use chrono::{DateTime, FixedOffset};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq)]
pub struct Card {
    pub id: i32,
    pub serial: String,
    pub name: String,
    pub created_at: DateTime<FixedOffset>,
    pub user_id: i32,
}
