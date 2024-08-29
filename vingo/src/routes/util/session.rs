use reqwest::StatusCode;
use tower_sessions::Session;
use user::Model;

use crate::entities::*;
use super::errors::ResponseResult;

pub async fn get_user(session: &Session) -> ResponseResult<Model> {
    session
        .get("user")
        .await
        .inspect_err(|e| eprintln!("error: {e}"))
        .or(Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to get session")))?
        .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "Not logged in"))
}