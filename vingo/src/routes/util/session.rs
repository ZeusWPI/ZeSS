use axum::extract::State;
use reqwest::StatusCode;
use sea_orm::EntityTrait;
use tower_sessions::Session;

use super::errors::{ResponseResult, ResultAndLogError};
use crate::{
    entities::{prelude::*, *},
    AppState,
};
pub enum SessionKeys {
    User,
    Season,
}

impl SessionKeys {
    pub fn as_str(&self) -> &'static str {
        match self {
            SessionKeys::User => "user",
            SessionKeys::Season => "season",
        }
    }
}

pub async fn get_user(session: &Session) -> ResponseResult<user::Model> {
    session
        .get(SessionKeys::User.as_str())
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "Failed to get session"))?
        .ok_or((StatusCode::UNAUTHORIZED, "Not logged in"))
}

pub async fn get_season(
    session: &Session,
    state: &State<AppState>,
) -> ResponseResult<season::Model> {
    let season: Option<season::Model> = session
        .get(SessionKeys::Season.as_str())
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "Failed to get session"))?;

    let season_or_default = match season {
        Some(season_model) => season_model,
        None => Season::find_by_id(0)
            .one(&state.db)
            .await
            .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get season"))?
            .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "no season 0"))?,
    };

    Ok(season_or_default)
}
