import { DataSource } from "typeorm";

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    'dist/src/modules/**/entities/*.entity{.ts,.js}',
  ],
  migrations: [ 
    `dist/migrations/*{.ts,.js}`,
  ],
  migrationsTableName: "migration_table",
})