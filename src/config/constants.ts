import path from "path";



/** 1 hour */
export const CACHE_EXPIRY = 60 * 60
export const SYSTEM_USER_ID = 1

export const GSM_PATTERN = /^9639[3-6-8-9]\d\d{3}\d{3}$/
export const MOBILE_PATTERN = /^09[3-6-8-9]\d\d{3}\d{3}$/

export const ASSETS_DIR = path.join(__dirname, `../../assets`)
