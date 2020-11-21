const express = require('express');
const router = express.Router();
const drillService = require('./drill.service');

router.get('/drills', (req,res) => {
    drillService.getDrills(req, res);
});

router.post('/drill',(req,res) => {
    drillService.postDrill(req,res);
});
module.exports = router;