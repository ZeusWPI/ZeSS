pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_users;
mod m20240829_234032_create_card;
mod m20240903_194156_create_scan;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_users::Migration),
            Box::new(m20240829_234032_create_card::Migration),
            Box::new(m20240903_194156_create_scan::Migration),
        ]
    }
}
