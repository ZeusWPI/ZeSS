use std::{env, sync::LazyLock};

use axum::extract::State;
use chrono::Local;
use reqwest::StatusCode;
use sea_orm::EntityTrait;
use tower_sessions::Session;

use super::errors::{ResponseResult, ResultAndLogError};
use crate::{
    entities::{prelude::*, *},
    AppState,
};

static DEBUG_LOGIN: LazyLock<bool> = LazyLock::new(|| env::var("DEBUG_LOGIN").unwrap_or("".into()) == "TRUE");
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
    // act as always logged in
    if *DEBUG_LOGIN {
        return Ok(user::Model { id: 1, name: "vincentest".into(), admin: true, created_at: Local::now().fixed_offset() });
    }

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
        None => Season::find_by_id(1)
            .one(&state.db)
            .await
            .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get season"))?
            .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "no season 1"))?,
    };

    Ok(season_or_default)
}
