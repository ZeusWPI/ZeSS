use reqwest::StatusCode;
use tower_sessions::Session;
use user::Model;

use super::errors::{ResponseResult, ResultAndLogError};
use crate::entities::*;

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


pub async fn get_user(session: &Session) -> ResponseResult<Model> {
    session
        .get(SessionKeys::User.as_str())
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "Failed to get session"))?
        .ok_or((StatusCode::UNAUTHORIZED, "Not logged in"))
}

pub type SeasonId = i32;

pub async fn get_season(session: &Session) -> ResponseResult<SeasonId> {
    Ok(session
        .get(SessionKeys::Season.as_str())
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "Failed to get session"))?
        .or(Some(0)) // set season to 0 (all) if none is set
        .expect("can't be none"))
}
