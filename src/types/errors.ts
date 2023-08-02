
export class UserInputError {
    constructor(properties: UserInputErrorProperty[], namespace: string, message: string = 'BAD USER INPUT', hook?: any) {
        Object.defineProperty(this, 'name', { value: 'UserInputError' });
        this.properties = properties
        this.namespace = namespace
        this.message = message
        this.hook = hook
        this.time = new Date().toISOString()
    }

    namespace?: string;
    properties: UserInputErrorProperty[] = [];
    message: string
    hook?: any
    status: number = 422
    time: string

}

export interface UserInputErrorProperty {
    field: string,
    message: string
    value?: any

}



export class AuthenticateError {
    constructor(message: string = 'not authenticated') {
        Object.defineProperty(this, 'name', { value: 'AuthenticateError' });

        this.message = message
        this.time = new Date().toISOString()

    }
    message: string
    status: number = 401
    time: string
}


export class AuthorizationError {
    constructor(message: string = 'not authorized') {
        Object.defineProperty(this, 'name', { value: 'AuthorizationError' });

        this.message = message
        this.time = new Date().toISOString()

    }
    message: string
    status: number = 403
    time: string
}



export class BadRequestError {
    constructor(message: string = 'Bad Request', status: number = 400) {
        Object.defineProperty(this, 'name', { value: 'BadRequestError' });

        this.message = message
        this.time = new Date().toISOString()
        this.status = status

    }
    message: string
    status: number
    time: string
}


