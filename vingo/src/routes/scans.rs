use crate::{entities::card, AppState};
use axum::extract::State;
use chrono::Local;
use reqwest::StatusCode;
use sea_orm::{ActiveModelTrait, Set};

use super::util::errors::{ResponseResult, ResultAndLogError};

const SCAN_KEY: &str = "bad_key";

pub async fn add(state: State<AppState>, body: String) -> ResponseResult<String> {
    let (serial, key) = body
        .split_once(";")
        .ok_or((StatusCode::BAD_REQUEST, "invalid format: serial;key"))?;
    if key != SCAN_KEY {
        Err((StatusCode::UNAUTHORIZED, "invalid key"))?
    }

    let mut registering = state.registering.lock().await;
    dbg!(&registering);

    // if someone is registering a card
    if Local::now() < registering.end {
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
        return Ok("card registered".to_string());
    }

    Ok(body)
}
