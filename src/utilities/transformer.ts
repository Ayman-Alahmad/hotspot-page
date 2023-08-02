import { FindOperator } from "typeorm";
import path from 'path'





export const assetsPathTransform = {

    from(value: string) {
        return !value ? value : path.join('/api', value)
    },
    to(value: string) {
        if (!value) return value
        const index = value.indexOf("/assets/"); // find the index of the "/clinics/" string
        return value.substring(index); // get the substring of the file path starting from the clinics index

    }
}




export const trimTransform = {
    from(value: string) {
        return value
    },
    to(value: string) {
        return typeof value === "string" ? value.trim() : value
    }
}
export const toUpperCaseTransform = {
    from(value: string) {
        return value
    },
    to(value: string) {
        return typeof value === "string" ? value.toUpperCase().trim() : value
    }
}

export const toLowerTransform = {
    from(value: string) {
        return value
    },
    to(value: string) {
        return typeof value === "string" ? value.toLowerCase().trim() : value
    }
}



export const phoneTransform = {

    from(value: string) {
        return value
    },
    to(value: string) {
        return typeof value === "string" ? value.replace(/\-|\s/g, '') : value
    }
}

export const mobileTransform = {

    from(value: string) {
        return value
    },
    to(value: string) {
        if (typeof value === "string") {
            return value.replace(/\s+/g, '').replace(/^(\+963|00963|963)/, '0')
        }
        return value
    }
}

export const gsmTransform = {

    from(value: string) {
        return value
    },
    to(value: string) {
        if (typeof value === "string") {
            return value.replace(/\s+/g, '').replace(/^(\+9639|009639|9639|09|9)/, '9639')
        }
        return value
    }
}


export const dateTransform = {
    from(value: string) {
        return value
    },
    to(obj: any) {
        if (obj instanceof FindOperator) {
            if (obj.type === 'between') {
                return new FindOperator(
                    'between',
                    [new Date(obj.value[0]), new Date(obj.value[1])],
                    obj.useParameter,
                    obj.multipleParameters,
                    obj.getSql,
                    obj.objectLiteralParameters)
            } else {
                return new FindOperator(obj.type,
                    new Date(obj.value),
                    obj.useParameter,
                    obj.multipleParameters,
                    obj.getSql,
                    obj.objectLiteralParameters)
            }
        }

        return new Date(obj)

    }
}



export const integerTransform = {
    from(value: string) {
        return value
    }, to(obj: any) {

        if (obj instanceof FindOperator) {
            if (obj.type === 'between') {
                return new FindOperator(
                    'between',
                    [Math.trunc(obj.value[0]), Math.trunc(obj.value[1])],
                    obj.useParameter,
                    obj.multipleParameters,
                    obj.getSql,
                    obj.objectLiteralParameters)
            }
            else {
                return new FindOperator(obj.type,
                    Array.isArray(obj.value) ? obj.value.map(v => Math.trunc(v)) : Math.trunc(obj.value),
                    obj.useParameter,
                    obj.multipleParameters,
                    obj.getSql,
                    obj.objectLiteralParameters)
            }
        }
        return Math.trunc(obj)
    }
}










