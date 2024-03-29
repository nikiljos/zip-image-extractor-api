const router = require('express').Router();
const controllers=require('./controllers.js')
const path = require('path')

router.get('/health',controllers.healthCheck)
router.get('/api',controllers.extractApi)

module.exports=router