use sea_orm_migration::{prelude::*, schema::*};

use crate::m20220101_000001_create_users::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Card {
    Table,
    Id,
    Serial,
    Name,
    CreatedAt,
    UserId,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Card::Table)
                    .col(pk_auto(Card::Id))
                    .col(text_uniq(Card::Serial))
                    .col(text(Card::Name).default(""))
                    .col(
                        timestamp_with_time_zone(Card::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .col(integer(Card::UserId))
                    .foreign_key(
                        ForeignKey::create()
                            .from(Card::Table, Card::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Card::Table).to_owned())
            .await
    }
}
