use reqwest::StatusCode;
use tower_sessions::Session;
use user::Model;

use super::errors::{ResponseResult, ResultAndLogError};
use crate::entities::*;

pub async fn get_user(session: &Session) -> ResponseResult<Model> {
    session
        .get("user")
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "Failed to get session"))?
        .ok_or((StatusCode::UNAUTHORIZED, "Not logged in"))
}
