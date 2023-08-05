import { NextFunction, Response, Request, Router } from "express";
import config from "../config/config";

import ejs from 'ejs'
import { MikrotikVariables } from "../types/mikrotik.variables";
import { Nas } from "../database/entities/nas";
import { SMS } from "../database/entities/sms";
import { create_wifi_user } from "./wifi.users";


const NAMESPACE = 'Miktotik';
const router = Router()


router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.redirect(`${config.MIKROTIK_HOTSPOT_DNS}/login`)
    } catch (error) {
        next(error)
    }
})



const getData = async (body: any) => {

    const mikrotik = new MikrotikVariables(body)
    const { mobile, verificationCode, password } = body

    const { profile, ...nas } = await Nas.findOne({
        loadEagerRelations: false, where: { nasname: mikrotik.server_address }, relations: ['profile']
    })

    return {
        mikrotik,
        nas,
        profile,
        mobile,
        password,
        verificationCode,
    }
}


router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {

        let template = ''
        const data = await getData(req.body)



        if (!data.nas.allow_SMS) {
            template = data.profile.login

        } else {
            if (data.mikrotik.username && data.mikrotik.error === "invalid username or password") {
                const sms = await SMS.findOne({ where: { username: data.mikrotik.username } })
                if (sms)
                    template = data.profile.verifySMS
            } else {
                template = data.profile.signIn
            }
        }


        res.setHeader('Content-Type', 'text/html');
        res.send(ejs.render(template, { data }))

    } catch (error) {
        next(error)
    }
})



router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
    const data = await getData(req.body)
    try {

        res.setHeader('Content-Type', 'text/html');
        res.send(ejs.render(data.profile.verifySMS, { data }))


    } catch (error) {
        next(error)
    }
})

router.post('/send-sms', async (req: Request, res: Response, next: NextFunction) => {
    const data = await getData(req.body)

    try {

        const user = await create_wifi_user({
            mobile: data.mobile,
            mac: data.mikrotik.mac,
            ip: data.mikrotik.ip,
            nasIPAdress: data.mikrotik.server_address,
            verificationCode: data.verificationCode
        })

        data.mikrotik.username=user.username
        res.setHeader('Content-Type', 'text/html');
        res.send(ejs.render(data.profile.verifySMS, { data }))

    } catch (error) {
        console.log(error);
        res.send(ejs.render(data.profile.signIn, { data }))
    }

})


router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getData(req.body)
        res.send(ejs.render(data.profile.logout, { data }))

    } catch (error) {
        next(error)
    }

})


router.post('/login/account', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const data = await getData(req.body)
        res.send(ejs.render(data.profile.login, { data }))

    } catch (error) {
        next(error)
    }

})


router.post('/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getData(req.body)
        res.send(ejs.render(data.profile.status, { data }))

    } catch (error) {
        next(error)
    }
})


router.get('/status', (req: Request, res: Response) => {
    res.redirect(`${config.MIKROTIK_HOTSPOT_DNS}/status`)
})
router.get('/login', (req: Request, res: Response) => {
    res.redirect(`${config.MIKROTIK_HOTSPOT_DNS}/login`)
})

router.use((req: Request, res: Response, next: NextFunction) => {
    res.redirect(`${config.MIKROTIK_HOTSPOT_DNS}/login`)
})


export = router
