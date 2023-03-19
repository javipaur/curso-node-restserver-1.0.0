
const { Router } = require('express');

const { farmaciasGet,
    cinesFloridaGet,
    cinesBoulevardGet,
    concietrosJimmyJazzGet} = require('../controllers/scraping');

const router = Router();


router.get('/farmacias', farmaciasGet );

router.get('/cines/florida', cinesFloridaGet );

router.get('/cines/boulevard', cinesBoulevardGet );

router.get('/conciertos/jimmyJazz', concietrosJimmyJazzGet );






module.exports = router;