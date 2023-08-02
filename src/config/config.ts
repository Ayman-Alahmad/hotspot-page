const HOTSPOT_DB = {
    host: process.env.HOTSPOT_DB_HOST,
    user: process.env.HOTSPOT_DB_USER,
    pass: process.env.HOTSPOT_DB_PASS,
    port: process.env.HOTSPOT_DB_PORT,
    db_name: process.env.HOTSPOT_DB_NAME
};

const SERVER = {
    hostname: 'localhost',
    port: 3008
};


const redis = {
    host: process.env.HOTSPOT_REDIS_HOST || 'localhost',
    port: +process.env.HOTSPOT_REDIS_PORT || 6379

}

const MTN = {
    user: process.env.MTN_SMS_USER,
    pass: process.env.MTN_SMS_PASS,
    sender:process.env.MTN_SMS_SENDER
}

const MIKROTIK_HOTSPOT_DNS = process.env.MIKROTIK_HOTSPOT_DNS || 'http://home.hotspot.sy'

const TOKEN_EXPIRES_IN = 60 * 15 //15 min !todo change expiry time 

const RADIUS_DATE_FORMAT = 'dd LLLL yyyy HH:mm'



const paths = {
    assets: process.env.DOLITTLE_ASSETS_URL_PREFIX,
}

const config = {
    db: HOTSPOT_DB,
    server: SERVER,
    token_expires: TOKEN_EXPIRES_IN,
    redis,
    radius: {
        data_format: RADIUS_DATE_FORMAT
    },
    sms: {
        mtn: MTN
    },
    MIKROTIK_HOTSPOT_DNS
}

export default config;