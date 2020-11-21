const express = require('express');
const router = express.Router();

router.get('/drills', (req,res) => {

    res.send(200, [
        {"id":1, "name": "Drill1" },{"id":2, "name": "Drill2" }
    ])
});
module.exports = router;