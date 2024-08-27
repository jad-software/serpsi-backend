import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: DataSource,
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                url: process.env.POSTGRES_URL,
                migrations: [__dirname + '/migrations/**/*{.ts}'],
                entities: [__dirname + '/../**/*.entity{.ts}'],
            });
            await dataSource.initialize(); // initialize the data source
            console.log('Database connected successfully');
            return dataSource;
        },
    },
];
