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

            return dataSource.initialize();
        },
    },
];
