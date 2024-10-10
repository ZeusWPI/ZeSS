use std::{env, sync::LazyLock};

use axum::extract::State;
use chrono::Local;
use reqwest::StatusCode;
use sea_orm::{sea_query::Expr, DatabaseConnection, EntityTrait, QueryFilter};
use tower_sessions::Session;

use super::errors::{ResponseResult, ResultAndLogError};
use crate::{
    entities::{prelude::*, *},
    AppState,
};

static DEBUG_LOGIN: LazyLock<bool> =
    LazyLock::new(|| env::var("DEBUG_LOGIN").unwrap_or("".into()) == "TRUE");

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
        return Ok(user::Model {
            id: 1,
            name: "vincentest".into(),
            admin: true,
            created_at: Local::now().fixed_offset(),
        });
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
        None => get_current_season_or_all(&state.db).await?,
    };

    Ok(season_or_default)
}

async fn get_current_season_or_all(db: &DatabaseConnection) -> ResponseResult<season::Model> {
    let curr_season = Season::find()
        .filter(
            Expr::col(season::Column::Id)
                .ne(1)
                .and(Expr::col(season::Column::End).gte(Expr::current_date()))
                .and(Expr::col(season::Column::Start).lte(Expr::current_date())),
        )
        .one(db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get season"))?;

    if let Some(curr_season) = curr_season {
        Ok(curr_season)
    } else {
        Ok(Season::find_by_id(1)
            .one(db)
            .await
            .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get season"))?
            .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "no season 1"))?)
    }
}
