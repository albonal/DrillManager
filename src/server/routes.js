const express = require('express');
const router = express.Router();

const drillService = require('./drill.service');

router.get('/drills', (req,res) => {

    drillService.getDrills(req, res);
    
    //res.send(200, [
    //    {"id":1, "name": "Drill1" },{"id":2, "name": "Drill2" }
    //])
});

router.post('/drill',(req,res) => {
    drillService.postDrill(req,res);
});
module.exports = router;