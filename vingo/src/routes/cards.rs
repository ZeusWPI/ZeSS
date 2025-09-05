use axum::{
    Json,
    extract::{Path, State},
};
use chrono::{Local, TimeDelta};
use database::{models::card::Card as RCard, repos::card::CardRepo};
use reqwest::StatusCode;
use sea_orm::*;
use serde::{Deserialize, Serialize};
use tower_sessions::Session;

use super::util::{
    errors::{ResponseResult, ResultAndLogError},
    session::get_user,
};
use crate::{
    AppState,
    entities::{prelude::*, *},
};

pub async fn get_for_current_user(
    session: Session,
    state: State<AppState>,
) -> ResponseResult<Json<Vec<RCard>>> {
    let user = get_user(&session).await?;
    let cards = state.database.cards().for_user(user.id).await.unwrap();

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
pub struct RegisterStatus {
    registering: bool,
    is_current_user: bool,
    success: bool,
    time_remaining: u32,
    time_percentage: f64,
}

pub async fn register_status(
    session: Session,
    state: State<AppState>,
) -> ResponseResult<Json<RegisterStatus>> {
    let user = get_user(&session).await?;
    let registering = state.registering.lock().await;

    let time_remaining = (registering.end - Local::now().fixed_offset()).num_seconds() as u32;
    Ok(Json(RegisterStatus {
        registering: Local::now().fixed_offset() < registering.end,
        is_current_user: user.id == registering.user,
        success: registering.last_success,
        time_remaining,
        time_percentage: f64::from(time_remaining) / 60.0,
    }))
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
