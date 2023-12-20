import DataSource from "./database.config"

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = DataSource;
      return dataSource.initialize();
    },
  },
];
