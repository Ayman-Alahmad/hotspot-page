
import axios from 'axios';
import { SMSQueue } from '../database/entities/sms.queue';
import { getDataSource } from '../data.source';
import { SMS } from '../database/entities/sms';
import { SMSArchived } from '../database/entities/sms.archived';
import config from "../config/config";



export const MTNSender = async (smsQueue: SMSQueue) => {
    try {


        console.log('MTN Sender Start');
        console.log('MTN Sender Data: ',smsQueue);
        

        // return await fakeSender(smsQueue)

        //return gsm or error msg
        const url = `https://services.mtnsyr.com:7443/General/MTNSERVICES/ConcatenatedSender.aspx?user=${config.sms.mtn.user}&pass=${config.sms.mtn.pass}&msg=${smsQueue.code}&from=${config.sms.mtn.sender}&lang=0&gsm=${smsQueue.gsm}`

        const response = await axios.get<string>(url)

        const isPassed = String(response.data) == smsQueue.gsm;

        smsQueue.attempts = smsQueue.attempts + 1
        smsQueue.lastAttemptDate = new Date()
        smsQueue.reply = response.data

        await getDataSource('admin').transaction(async manager => {
            //PASSED
            if (isPassed) {
                await manager.insert(SMS, {
                    username: smsQueue.username,
                    gsm: smsQueue.gsm,
                    code: smsQueue.code,
                    ipAddress: smsQueue.ipAddress,
                    mac: smsQueue.mac,
                    nasname: smsQueue.nasname,
                    posId: smsQueue.posId,
                    sendDate: new Date(),
                    reply: response.data,
                    attempts: smsQueue.attempts
                })
                await manager.delete(SMSQueue, { id: smsQueue.id })
               // socketEmitter({ action: 'PASSED', key: smsQueue.id, data: smsQueue })

            } else {
                // FAIL
                if (smsQueue.attempts > 2) {
                    await manager.insert(SMSArchived, smsQueue)
                    await manager.delete(SMSQueue, { id: smsQueue.id })
                }
                else {
                    await SMSQueue.update({ id: smsQueue.id }, { attempts: smsQueue.attempts, lastAttemptDate: new Date(), reply: smsQueue.reply })
                }
             //   socketEmitter({ action: smsQueue.attempts > 2 ? 'ARCHIVED' : 'FAIL', key: smsQueue.id, data: smsQueue })
            }




        })




    } catch (error) {
        console.log(error);
        return false
    }

}
export const scheduled_sms_sender = async () => {

    try {
        await getDataSource('admin').transaction(async manager => {
            const smsList = await manager.find(SMSQueue, { take: 100 })
            for (let i = 0; i < smsList.length; i++) {
                const sms = smsList[i];
                await MTNSender(sms)
            }
        })
    } catch (error) {
        console.log(error);
    }

}

type SMSSocketEmitterArg = {
    action: 'PASSED' | 'FAIL' | 'ARCHIVED',
    data?: { [P in keyof SMSQueue]?},
    key: any
}



export const fakeSender = async (smsQueue: SMSQueue) => {

    try {
        const isPassed = Math.random() < 0.5;
        smsQueue.attempts = smsQueue.attempts + 1
        smsQueue.lastAttemptDate = new Date()
        smsQueue.reply = isPassed ? smsQueue.gsm : 'Error # ' + Math.random()

        await getDataSource('admin').transaction(async manager => {


            if (isPassed) {

                await manager.insert(SMS, {
                    username: smsQueue.username,
                    gsm: smsQueue.gsm,
                    code: smsQueue.code,
                    ipAddress: smsQueue.ipAddress,
                    mac: smsQueue.mac,
                    nasname: smsQueue.nasname,
                    posId: smsQueue.posId,
                    sendDate: new Date(),
                    reply: smsQueue.gsm,
                    attempts: smsQueue.attempts
                })
                await manager.delete(SMSQueue, { id: smsQueue.id })
             //   socketEmitter({ action: 'PASSED', key: smsQueue.id, data: smsQueue })

            }
            else {
                // FAIL
                if (smsQueue.attempts > 2) {
                    await manager.insert(SMSArchived, smsQueue)
                    await manager.delete(SMSQueue, { id: smsQueue.id })
                }
                else {
                    await SMSQueue.update({ id: smsQueue.id }, { attempts: smsQueue.attempts, lastAttemptDate: new Date(), reply: smsQueue.reply })
                }
            //    socketEmitter({ action: smsQueue.attempts > 2 ? 'ARCHIVED' : 'FAIL', key: smsQueue.id, data: smsQueue })
            }

        })

        return isPassed

    } catch (error) {
        console.log(error);
        return false
    }

}
