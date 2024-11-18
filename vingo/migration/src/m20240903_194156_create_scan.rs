use crate::m20240829_234032_create_card::Card;
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Scan {
    Table,
    Id,
    Time,
    CardSerial,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .create_table(
                Table::create()
                    .table(Scan::Table)
                    .col(pk_auto(Scan::Id))
                    .col(text(Scan::CardSerial))
                    .col(timestamp_with_time_zone(Scan::Time).default(Expr::current_timestamp()))
                    .foreign_key(
                        ForeignKey::create()
                            .from(Scan::Table, Scan::CardSerial)
                            .to(Card::Table, Card::Serial),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Scan::Table).to_owned())
            .await
    }
}
