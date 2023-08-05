import { DateTime } from "luxon";
import { gsmTransform } from "../utilities/transformer";
import { BadRequestError } from "../types/errors";
import { GSM_PATTERN } from "../config/constants";
import { getDataSource } from "../data.source";
import { Nas } from "../database/entities/nas";
import { Policies } from "../database/entities/policies";
import { Nat } from "../database/entities/nat";
import { SMSQueue } from "../database/entities/sms.queue";
import { Subscribers } from "../database/entities/subscribers";
import { Radcheck } from "../database/entities/radcheck";
import config from "../config/config";
import { MTNSender } from "./mtn";


export const getExpiration = (policy: Policies) => {
    return DateTime.now().plus({ [policy.period]: policy.duration })
}
export type USER_VIS_SMS_ARG = { mobile: string, mac: string, ip: string, nasIPAdress: string, verificationCode?: string }

export const randomCode = () => {
    return Math.floor(Math.random() * (999 - 100 + 1) + 100) + '-' + Math.floor(Math.random() * (999 - 100 + 1) + 100);
}


export const create_wifi_user = async (arg: USER_VIS_SMS_ARG, checkTwoStepVerification = true): Promise<{ username: string, expiration: DateTime, mobile: string }> => {

    return new Promise(async (resolve, reject) => {
        try {

            const gsm = gsmTransform.to(arg.mobile)

            const regx = new RegExp(GSM_PATTERN)

            if (!regx.test(gsm))
                throw new BadRequestError('Invalid mobile!')


            const result = await getDataSource('admin').transaction(async manager => {

                // get clean NAS IP Address (V4)
                const cleanIPRegx = new RegExp(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)
                const match = cleanIPRegx.exec(arg.nasIPAdress)
                if (!match)
                    reject('Unknown NAS IP Address!')
                const nasname = match[0]

                // validate NAS
                const nas = await manager.findOne(Nas, { where: { nasname, status: 'enabled' }, loadEagerRelations: false, relations: ['policy', 'pos'] })

                if (!nas)
                    throw new BadRequestError('Undefined NAS')

                if (nas.pos.status != 'enabled')
                    throw new BadRequestError('Disabled POS')
                // get nat ip
                const nat = await manager.findOne(Nat, { where: { privateIp: arg.ip }, relations: ['policy'] })

                if (!nat)
                    throw new BadRequestError('Undefined NAT')


                const policy: Policies = nat.policy ? nat.policy : nas.policy

                if (!policy)
                    throw new BadRequestError('Undefined policy')


                if (checkTwoStepVerification) {

                    if (nas.twoStepVerification && arg.verificationCode != nas.verificationCode)
                        throw new BadRequestError('Invalid verification code.')

                }


                // smsQueue
                const smsQueue = manager.getRepository(SMSQueue)
                    .create({
                        username: new Date().getTime().toString(),
                        gsm: gsm,
                        code: randomCode(),
                        ipAddress: arg.ip,
                        mac: arg.mac,
                        nasname: nas.nasname,
                        posId: nas.posId,
                        createdAt:new Date(),
                        lastAttemptDate:null,
                        reply:'',
                        attempts:0
                    })

                await manager.insert(SMSQueue, smsQueue)

               console.log(smsQueue);
                    


                const expiration = getExpiration(policy)
                // add subscriber  
                await manager.insert(Subscribers, {
                    username: smsQueue.username,
                    password: smsQueue.code,
                    groupname: policy.name,
                    expiration,
                    mobile: smsQueue.gsm,
                    posId: nas.posId,
                    nasname: nas.nasname,
                    createdAt:new Date(),
                    updatedAt:new Date()
              
                })

                console.log('Subscribers created');
                

                await manager.insert(Radcheck, [
                    {
                        username: smsQueue.username,
                        attribute: 'Cleartext-Password',
                        op: ':=',
                        value: smsQueue.code
                    },
                    {
                        username: smsQueue.username,
                        attribute: 'Expiration',
                        op: ':=',
                        value: getExpiration(policy).toFormat(config.radius.data_format)
                    },
                    {
                        username: smsQueue.username,
                        attribute: 'NAS-IP-Address',
                        op: ':=', value: nas.nasname
                    }
                ])



                return { smsQueue, expiration }

            })

            await MTNSender(result.smsQueue)
            resolve({ username: result.smsQueue.username, expiration: result.expiration, mobile: arg.mobile })

        } catch (error) {
            console.log(error);
            
            if (error.status === 400)
                reject(error.message)
            else
                reject('unexpected error')
        }
    })

}


