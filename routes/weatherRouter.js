const express = require('express');
const router = express.Router()

const {getFomatedWeatherdataBycity,getFomatedWeatherdataBylat}=require('../controllers/getFormatedWeaatherData')


router.get('/getweatherdata/:city/:units',getFomatedWeatherdataBycity)
router.get('/getweatherdatabylat/:lat/:lon/:units',getFomatedWeatherdataBylat)

module.exports=router;