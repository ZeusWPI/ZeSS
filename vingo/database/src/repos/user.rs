use sqlx::PgPool;

pub struct UserRepo<'a> {
    db: &'a PgPool,
}

impl<'a> UserRepo<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }
}
