use crate::{
    entities::{prelude::*, *},
    AppState,
};

use axum::{extract::State, Json};
use chrono::Local;
use reqwest::StatusCode;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, JoinType::InnerJoin, QueryFilter, QuerySelect,
    RelationTrait, Set,
};
use tower_sessions::Session;

use super::util::{
    errors::{ResponseResult, ResultAndLogError},
    session::get_user,
};

const SCAN_KEY: &str = "bad_key";

pub async fn get_for_current_user(
    session: Session,
    state: State<AppState>,
) -> ResponseResult<Json<Vec<scan::Model>>> {
    let user = get_user(&session).await?;
    let scans = Scan::find()
        .join(InnerJoin, scan::Relation::Card.def())
        .join(InnerJoin, card::Relation::User.def())
        .filter(user::Column::Id.eq(user.id))
        .all(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get scans"))?;

    Ok(Json(scans))
}

pub async fn add(state: State<AppState>, body: String) -> ResponseResult<String> {
    let (serial, key) = body
        .split_once(';')
        .ok_or((StatusCode::BAD_REQUEST, "invalid format: serial;key"))?;
    if key != SCAN_KEY {
        Err((StatusCode::UNAUTHORIZED, "invalid key"))?
    }

    let mut registering = state.registering.lock().await;

    // if someone is registering a card
    if Local::now().fixed_offset() < registering.end {
        dbg!("ohno registering");
        let db_result = card::ActiveModel {
            serial: Set(serial.to_owned()),
            user_id: Set(registering.user),
            ..Default::default()
        }
        .insert(&state.db)
        .await;

        // end registering session
        registering.user = -1;
        registering.end = Local::now().fixed_offset();
        registering.last_success = db_result.is_ok();

        db_result.or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to insert card"))?;
        Ok("card registered".to_string())
    } else {
        if !serial.chars().all(|ch| char::is_ascii_hexdigit(&ch)) {
            return Err((StatusCode::BAD_REQUEST, "not valid hex"));
        }
        scan::ActiveModel {
            card_serial: Set(serial.to_string()),
            scan_time: Set(Local::now().fixed_offset()),
            ..Default::default()
        }
        .insert(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to insert scan"))?;
        Ok("scanned".to_string())
    }
}
