use std::sync::Mutex;

use axum::{
    extract::{Path, State},
    Extension, Json,
};
use chrono::{Local, TimeDelta};
use reqwest::StatusCode;
use sea_orm::*;
use serde::{Deserialize, Serialize};
use tower_sessions::Session;

use super::util::{
    errors::{ResponseResult, ResultAndLogError},
    session::get_user,
};
use crate::{
    entities::{prelude::*, *},
    AppState,
};

pub async fn get_for_current_user(
    session: Session,
    state: State<AppState>,
) -> ResponseResult<Json<Vec<card::Model>>> {
    let user = get_user(&session).await?;
    let cards = Card::find()
        .filter(card::Column::UserId.eq(user.id))
        .all(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get cards"))?;

    Ok(Json(cards))
}

pub async fn start_register(session: Session, state: State<AppState>) -> ResponseResult<()> {
    let user = get_user(&session).await?;
    let mut registering = state.registering.lock().await;
    if Local::now() < registering.end {
        Err((
            StatusCode::SERVICE_UNAVAILABLE,
            "someone is already registering a card",
        ))?
    }

    registering.user = user.id;
    registering.end = Local::now().fixed_offset() + TimeDelta::minutes(1);

    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CardUpdate {
    name: String,
}

pub async fn update(
    session: Session,
    state: State<AppState>,
    Path(card_id): Path<i32>,
    Json(new_card): Json<CardUpdate>,
) -> ResponseResult<()> {
    let user = get_user(&session).await?;
    let mut card = Card::find_by_id(card_id)
        .filter(card::Column::UserId.eq(user.id))
        .one(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get card"))?
        .ok_or((StatusCode::NOT_FOUND, "card not found"))?
        .into_active_model();

    card.name = Set(new_card.name);
    card.update(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to update card"))?;

    Ok(())
}
