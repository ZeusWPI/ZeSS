use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Season {
    Table,
    Id,
    Name,
    Start,
    End,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Season::Table)
                    .col(pk_auto(Season::Id))
                    .col(text(Season::Name))
                    .col(date(Season::Start))
                    .col(date(Season::End))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Season::Table).to_owned())
            .await
    }
}