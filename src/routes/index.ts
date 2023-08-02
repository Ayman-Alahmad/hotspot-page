import express from 'express'
import page from '../controllers/page'


const router = express.Router()

//------------------MIKROTIK ROUTER--------------------------------
router.use('/', page)

export = router