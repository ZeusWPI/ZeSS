use axum::{extract::State, Json};
use reqwest::StatusCode;
use sea_orm::EntityTrait;
use serde::{Deserialize, Serialize};
use tower_sessions::Session;

use crate::{
    entities::prelude::*,
    AppState,
};

use super::util::{
    errors::{ResponseResult, ResultAndLogError},
    session::{get_season, SessionKeys},
};

#[derive(Debug, Serialize, Deserialize)]
pub struct SettingsGetBody {
    season: i32,
}
pub async fn get(session: Session, state: State<AppState>) -> ResponseResult<Json<SettingsGetBody>> {
    let season = get_season(&session, &state).await?;
    Ok(Json(SettingsGetBody { season: season.id }))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SettingsUpdateBody {
    season: Option<i32>,
}
pub async fn update(
    session: Session,
    state: State<AppState>,
    Json(settings): Json<SettingsUpdateBody>,
) -> ResponseResult<()> {
    if let Some(season_id) = settings.season {
        let season = Season::find_by_id(season_id)
            .one(&state.db)
            .await
            .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get season"))?
            .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "no season 0"))?;
        session
            .insert(SessionKeys::Season.as_str(), season)
            .await
            .or_log((
                StatusCode::INTERNAL_SERVER_ERROR,
                "failed to insert season into session",
            ))?;
    }

    Ok(())
}
