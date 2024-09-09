use axum::extract::{Path, State};
use reqwest::StatusCode;
use tower_sessions::Session;

use crate::{
    entities::{prelude::*, *},
    AppState,
};

use super::util::{errors::{ResponseResult, ResultAndLogError}, session::{self, SessionKeys}};


pub async fn set_season(state: State<AppState>, session: Session, Path(season_id): Path<i32>) -> ResponseResult<()> {
    session.insert(SessionKeys::Season.as_str(), season_id).await.or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to insert season into session"))?;

    Ok(())
}