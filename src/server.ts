

import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata";
import http from 'http';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import config from './config/config';
import cros from "cors"


import { db_initiate } from './data.source';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import logging from './config/logging';
import router from './routes';



const NAMESPACE = 'Server';
const app = express();

//app.use(helmet({}));

/** Rules of our API */
app.use(cros({ origin: ['http://localhost:4300', 'http://localhost:4200'] }))


app.use('/api/assets', express.static('assets'))


app.set('trust proxy', true)

/** Log the request */
app.use(logger)

/**Parse the body of the request  (body-parser) */
app.use(json());
app.use(urlencoded({ extended: true }));


/** Routes go here */
app.use('/', router);

/** 404 Error handling */
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not found'
    });
});


/** The default error handler */
app.use(errorHandler)


const ServerStart = async () => {
    try {

        // start all databases connections
        await db_initiate({ logging: true, synchronize: false, migration: true })

        // start redis client

        // craete http server
        const httpServer = http.createServer(app);

        // init Socket.io Server

        httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running on ${config.server.hostname}:${config.server.port}`.green));

        // cron.schedule('*/1 * * * *', () => {
        //     scheduled_sms_sender()
        // })


    } catch (error) {
        console.log(error);
    }

}

ServerStart();
