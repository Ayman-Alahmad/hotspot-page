import { Response, Request, NextFunction } from "express";
import logging from "../config/logging";
import { getDataSource } from "../data.source";
import { SystemErrorsLog } from "../database/entities/system_errors_log";




/** The default error handler */
export const errorHandler = async (err: any, request: Request, response: Response, nex: NextFunction) => {
    try {
        await logErrorToDataBase(err, request)
        switch (err.name) {
            case 'UserInputError':
                logging.error(err.namespace, err.message, err.properties)
                console.table(err.properties)
                return response.status(err.status).json(err)

            case 'AuthenticateError':
            case 'AuthorizationError':
                logging.error(err.name, err.message)
                return response.status(err.status).send(err.message)

            case 'BadRequestError':
            case 'EntityPropertyNotFoundError':
                logging.error(err.name, err.message)
                return response.status(err.status || 400).send(err.message)
            case 'QueryFailedError':
                logging.error(err.name, err.message)
                return dataBaseErrorHandler(response, err)

            case 'MulterError':
                logging.error(err.name, err.message)
                return response.status(422).send(err.message)

            default:
                console.error(err)
                response.status(500).send('internal server error')
        }
    } catch (error) {
        console.error(error);
    }

}


const dataBaseErrorHandler = (response: Response, error: { code: number }) => {
    console.log(error);

    switch (+error.code) {
        case 1:
        case 23505:
            response.status(400).send('Duplicate value')
            break;
        case 23503://violated - child record found
            response.status(400).send('This record is essential for others records')
            break;

        case 2291:
            response.status(400).send('Parent key not found')
            break;

        default:
            response.status(500).send('Database error')
            break;
    }

}



const logErrorToDataBase = async (err: any, request: Request) => {

    try {


        //* protect any password from any log 
        const data = Object.assign({}, request.body)
        if (data.hasOwnProperty('password'))
            data.password = '********'

        const payload = request['payload'] 

        const repository = getDataSource('admin').getRepository(SystemErrorsLog)

        const entity = repository.create({
            errorDate:new Date(),
            url: request.url,
            method: request.method,
            errorCode: err.status || '500',
            error: err.message,
            data: JSON.stringify(data),
            userId: payload?.userId,
            ip: request.socket.remoteAddress,
            userAgent: request['ua']?.getResult()
        })
        await repository.insert(entity)


    } catch (error) {
        console.error(error)
    }
}