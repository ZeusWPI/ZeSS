use std::{env, sync::LazyLock};

use crate::{
    entities::{prelude::*, *},
    AppState,
};

use axum::{extract::State, Json};
use chrono::{Duration, Local};
use migration::Expr;
use reqwest::StatusCode;
use sea_orm::{
    entity::prelude::DateTimeWithTimeZone,
    ActiveModelTrait, ColumnTrait, EntityTrait, FromQueryResult, IdenStatic,
    JoinType::{self, InnerJoin},
    QueryFilter, QueryOrder, QuerySelect, RelationTrait, Set,
};
use serde::Serialize;
use tower_sessions::Session;

use super::util::{
    errors::{ResponseResult, ResultAndLogError},
    session::{get_season, get_user},
};

static SCAN_KEY: LazyLock<String> =
    LazyLock::new(|| env::var("SCAN_KEY").expect("SCAN_KEY not present"));

pub async fn get_for_current_user(
    session: Session,
    state: State<AppState>,
) -> ResponseResult<Json<Vec<scan::Model>>> {
    let user = get_user(&session).await?;
    let season = get_season(&session, &state).await?;
    let scans = Scan::find()
        .join(InnerJoin, scan::Relation::Card.def())
        .join(InnerJoin, card::Relation::User.def())
        .filter(user::Column::Id.eq(user.id))
        // scan time > start && scan_time < end
        .filter(scan::Column::ScanTime.gte(season.start))
        .filter(scan::Column::ScanTime.lte(season.end))
        .all(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get scans"))?;

    Ok(Json(scans))
}

pub async fn add(state: State<AppState>, body: String) -> ResponseResult<String> {
    let (serial, key) = body
        .split_once(';')
        .ok_or((StatusCode::BAD_REQUEST, "invalid format: serial;key"))?;
    if key != SCAN_KEY.to_string() {
        Err((StatusCode::UNAUTHORIZED, "invalid key"))?
    }

    if !serial.chars().all(|ch| char::is_ascii_hexdigit(&ch)) {
        return Err((StatusCode::BAD_REQUEST, "not valid hex"));
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
    }

    scan::ActiveModel {
        card_serial: Set(serial.to_string()),
        scan_time: Set(Local::now().fixed_offset()),
        ..Default::default()
    }
    .insert(&state.db)
    .await
    .or_log((
        StatusCode::INTERNAL_SERVER_ERROR,
        "no card with that serial",
    ))?;

    let user = Card::find()
        .filter(card::Column::Serial.eq(serial))
        .find_also_related(User)
        .one(&state.db)
        .await
        .or_log((
            StatusCode::INTERNAL_SERVER_ERROR,
            "failed to get user for card",
        ))?
        .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "no card"))?
        .1
        .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "no user for card"))?;

    Ok(user.name)
}

#[derive(Debug, FromQueryResult, Serialize)]
pub struct RecentScanItem {
    id: i32,
    scan_time: DateTimeWithTimeZone,
}

pub async fn recent(state: State<AppState>) -> ResponseResult<Json<Vec<RecentScanItem>>> {
    let fourteen_days_ago = (Local::now() - Duration::days(14)).naive_local();
    let scans = Scan::find()
        .select_only()
        .expr(Expr::cust(format!(
            "DISTINCT ON ({}, DATE({})) scan.{}, scan.{}", //NOTE: this is a pain
            card::Column::UserId.as_str(),
            scan::Column::ScanTime.as_str(),
            scan::Column::Id.as_str(),
            scan::Column::ScanTime.as_str(),
        )))
        .join(JoinType::InnerJoin, scan::Relation::Card.def())
        .filter(scan::Column::ScanTime.gt(fourteen_days_ago))
        .order_by_asc(Expr::cust(format!(
            "DATE({})",
            scan::Column::ScanTime.as_str()
        )))
        .into_model::<RecentScanItem>()
        .all(&state.db)
        .await
        .or_log((
            StatusCode::INTERNAL_SERVER_ERROR,
            "could not get all recent scans",
        ))?;

    Ok(Json(scans))
}
