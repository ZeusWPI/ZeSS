use sqlx::{PgPool, migrate::MigrateDatabase, postgres::PgPoolOptions};

use crate::{
    error::DatabaseError,
    repos::{card::CardRepo, user::UserRepo},
};

pub mod models {
    pub mod card;
    pub mod user;
}

pub mod repos {
    pub mod card;
    pub mod user;
}

pub mod error;

#[derive(Debug, Clone)]
pub struct Database {
    db: PgPool,
}

impl Database {
    pub fn new(db: PgPool) -> Self {
        Self { db }
    }

    pub async fn create_connect_migrate(db_url: &str) -> Result<Self, DatabaseError> {
        // create database if not exists
        // sqlx::Postgres::create_database(db_url).await?;

        // conntect to database
        let db = PgPoolOptions::new()
            .max_connections(5)
            .connect(db_url)
            .await?;

        // run migrations
        // sqlx::migrate!("../migrations").run(&db).await?;

        Ok(Self { db })
    }

    pub fn users<'a>(&'a self) -> UserRepo<'a> {
        UserRepo::new(&self.db)
    }

    pub fn cards<'a>(&'a self) -> CardRepo<'a> {
        CardRepo::new(&self.db)
    }
}
