use axum::{
    extract::{Path, State},
    Json,
};
use chrono::NaiveDate;

use reqwest::StatusCode;
use sea_orm::{sea_query::Expr, DatabaseConnection};
use sea_orm::{
    ActiveModelTrait, EntityTrait, FromQueryResult, QueryFilter, QuerySelect, QueryTrait, Set,
};
use serde::{Deserialize, Serialize};

use crate::{
    entities::{prelude::*, *},
    AppState,
};

use super::util::errors::{ResponseResult, ResultAndLogError};

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct SeasonGet {
    id: i32,
    name: String,
    start: NaiveDate,
    end: NaiveDate,
    is_current: bool,
}

pub async fn get_until_now(state: State<AppState>) -> ResponseResult<Json<Vec<SeasonGet>>> {
    Ok(Json(db_seasons(&state.db, false).await?))
}

pub async fn get_all(state: State<AppState>) -> ResponseResult<Json<Vec<SeasonGet>>> {
    Ok(Json(db_seasons(&state.db, true).await?))
}

pub async fn db_seasons(db: &DatabaseConnection, future: bool) -> ResponseResult<Vec<SeasonGet>> {
    Season::find()
        .column_as(
            Expr::col(season::Column::Start)
                .lte(Expr::current_date())
                .and(Expr::col(season::Column::End).gte(Expr::current_date()))
                .and(Expr::col(season::Column::Id).ne(1)),
            "is_current",
        )
        .apply_if((!future).then_some(()), |query, _| {
            query.filter(Expr::col(season::Column::Start).lt(Expr::current_date()))
        })
        .into_model::<SeasonGet>()
        .all(db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get seasons"))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SeasonAddBody {
    name: String,
    start: NaiveDate,
    end: NaiveDate,
}
pub async fn add(
    state: State<AppState>,
    Json(new_season): Json<SeasonAddBody>,
) -> ResponseResult<()> {
    season::ActiveModel {
        name: Set(new_season.name),
        start: Set(new_season.start),
        end: Set(new_season.end),
        ..Default::default()
    }
    .insert(&state.db)
    .await
    .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to insert season"))?;

    Ok(())
}

pub async fn delete(state: State<AppState>, Path(season_id): Path<i32>) -> ResponseResult<()> {
    Season::delete_by_id(season_id)
        .exec(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to delete day"))?;
    Ok(())
}
