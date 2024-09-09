use axum::{
    extract::{Path, State},
    Json,
};
use chrono::{DateTime, Datelike, FixedOffset, NaiveDate, TimeDelta, Weekday};
use reqwest::StatusCode;
use sea_orm::{ActiveModelTrait, EntityTrait, Set, TransactionTrait};
use serde::{Deserialize, Serialize};

use crate::{
    entities::{prelude::*, *},
    AppState,
};

use super::util::errors::{ResponseResult, ResultAndLogError};

pub async fn get(state: State<AppState>) -> ResponseResult<Json<Vec<season::Model>>> {
    Ok(Json(Season::find().all(&state.db).await.or_log((
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to get seasons",
    ))?))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SeasonAddBody {
    name: String,
    start: NaiveDate,
    end: NaiveDate,
}
pub async fn add(state: State<AppState>, Json(new_season): Json<SeasonAddBody>) -> ResponseResult<()> {
    season::ActiveModel {
        name: Set(new_season.name),
        start: Set(new_season.start),
        end: Set(new_season.end),
        ..Default::default()
    }.insert(&state.db).await.or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to insert season"))?;

    Ok(())
}

pub async fn delete(state: State<AppState>, Path(season_id): Path<i32>) -> ResponseResult<()> {
    Season::delete_by_id(season_id)
        .exec(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to delete day"))?;
    Ok(())
}
