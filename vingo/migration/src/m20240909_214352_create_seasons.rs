use sea_orm_migration::{prelude::*, schema::*};
use chrono::NaiveDate;

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
            .await?;
        
        // insert the first season (which is all data)
        let insert = Query::insert()
        .into_table(Season::Table)
        .columns([Season::Name, Season::Start, Season::End])
        .values_panic(["All".into(), NaiveDate::from_ymd_opt(2000, 1, 1).unwrap().into(), NaiveDate::from_ymd_opt(3000, 1, 1).unwrap().into()])
        .to_owned();

        manager.exec_stmt(insert).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Season::Table).to_owned())
            .await
    }
}
