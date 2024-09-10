use axum::{
    extract::{Path, State},
    Json,
};
use chrono::{Datelike, NaiveDate, TimeDelta, Weekday};
use reqwest::StatusCode;
use sea_orm::{ActiveModelTrait, EntityTrait, Set, TransactionTrait};
use serde::{Deserialize, Serialize};

use crate::{
    entities::{prelude::*, *},
    AppState,
};

use super::util::errors::{ResponseResult, ResultAndLogError};

pub async fn get(state: State<AppState>) -> ResponseResult<Json<Vec<day::Model>>> {
    Ok(Json(Day::find().all(&state.db).await.or_log((
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to get days",
    ))?))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DaysBody {
    start_date: NaiveDate,
    end_date: NaiveDate,
}

pub async fn add_multiple(
    state: State<AppState>,
    Json(day_range): Json<DaysBody>,
) -> ResponseResult<()> {
    let txn = state.db.begin().await.or_log((
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to start transaction",
    ))?;

    let mut current_date = day_range.start_date;
    while current_date <= day_range.end_date {
        if current_date.weekday() == Weekday::Sat || current_date.weekday() == Weekday::Sun {
            current_date += TimeDelta::days(1);
            continue;
        }
        day::ActiveModel {
            date: Set(current_date),
            ..Default::default()
        }
        .save(&txn)
        .await
        .or_log((
            StatusCode::INTERNAL_SERVER_ERROR,
            "failed to save date; does it already exist?",
        ))?;
        current_date += TimeDelta::days(1);
    }

    txn.commit().await.or_log((
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to end transaction",
    ))?;
    Ok(())
}

pub async fn delete(state: State<AppState>, Path(day_id): Path<i32>) -> ResponseResult<()> {
    Day::delete_by_id(day_id)
        .exec(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to delete day"))?;
    Ok(())
}
