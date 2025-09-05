use sqlx::PgPool;

use crate::{error::DatabaseError, models::card::Card};

pub struct CardRepo<'a> {
    db: &'a PgPool,
}

impl<'a> CardRepo<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn for_user(&self, user_id: i32) -> Result<Vec<Card>, DatabaseError> {
        Ok(sqlx::query_as(
            "
            SELECT id, serial, name, created_at, user_id
            FROM card
            WHERE user_id = $1;
            ",
        )
        .bind(user_id)
        .fetch_all(self.db)
        .await?)
    }
}
