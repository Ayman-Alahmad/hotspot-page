import { DataSource } from "typeorm"
import config from "./config/config"


declare type DBConnectionOptions = { logging?: boolean, synchronize?: boolean, migration?: boolean }

const databases: Map<string, DataSource> = new Map()

export const db_initiate = async (options: DBConnectionOptions = { logging: false, synchronize: false }) => {

    const dataSource = new DataSource({
        type: 'postgres',
        port: +config.db.port,
        host: config.db.host,
        username: config.db.user,
        password: config.db.pass,
        database: config.db.db_name,
        synchronize: options.synchronize,
        logging: options.logging,
        applicationName: "Hotspot API",
        connectTimeoutMS: 3000,
        entities: [
            __dirname + "/database/entities/**/*{.ts,.js}"
        ],
        migrations: [
            __dirname + "/database/migrations/**/*{.ts,.js}",
        ],
        extra: {
            // maximum number of clients the pool should contain
            // by default this is set to 10.
            max: 5,
            // number of milliseconds a client must sit idle in the pool and not be checked out
            // before it is disconnected from the backend and discarded
            // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
            idleTimeoutMillis: 10000,
        }
    })
    await dataSource.initialize()

    if (options.migration)
        await dataSource.runMigrations()




    databases.set('admin', dataSource)
}

export const getDataSource = (name: string = 'admin') => {
    return databases.get(name)
}
