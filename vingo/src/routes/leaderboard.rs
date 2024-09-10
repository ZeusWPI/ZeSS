use axum::{extract::State, Json};
use chrono::{DateTime, FixedOffset, Local, TimeDelta};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};

use sea_orm::{DbBackend, FromQueryResult, Statement};

use crate::AppState;

use super::util::errors::{ResponseResult, ResultAndLogError};

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct LeaderboardItem {
    id: i32,
    name: String,
    total_days: i64,
    position: i64,
    position_change: Option<i64>,
}

pub async fn get(state: State<AppState>) -> ResponseResult<Json<Vec<LeaderboardItem>>> {
    let mut leaderboard = leaderboard_from_db(&state, Local::now().fixed_offset()).await?;
    let leaderboard_last_week =
        leaderboard_from_db(&state, Local::now().fixed_offset() - TimeDelta::days(7)).await?;

    for user in &mut leaderboard {
        let position_change = leaderboard_last_week
            .iter()
            .find(|v| v.id == user.id)
            .and_then(|v| Some(v.position - user.position));
        user.position_change = position_change;
    }

    Ok(Json(leaderboard))
}

async fn leaderboard_from_db(
    state: &State<AppState>,
    before: DateTime<FixedOffset>,
) -> ResponseResult<Vec<LeaderboardItem>> {
    let result = LeaderboardItem::find_by_statement(Statement::from_sql_and_values(DbBackend::Postgres,"
            SELECT id, name, count as total_days, RANK() OVER (ORDER BY count desc) AS position
                FROM (SELECT COUNT(DISTINCT ((scan_time - INTERVAL '4 hours') AT TIME ZONE 'Europe/Brussels')::date), \"user\".id, \"user\".name
                    FROM scan
                        LEFT JOIN card ON card_serial = serial
                        LEFT JOIN \"user\" ON user_id = \"user\".id
                        WHERE scan_time < $1
                        GROUP BY \"user\".name, \"user\".id);", [before.into()]))
        .all(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "could not select leaderboard items"))?;

    Ok(result)
}