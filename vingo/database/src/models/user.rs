use chrono::{DateTime, FixedOffset};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub admin: bool,
    pub created_at: DateTime<FixedOffset>,
}
