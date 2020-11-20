const express = require('express');
const router = express.Router();

router.get('/drills', (req,res) => {

    res.send(200, [
        {"id":10, "name": "Drill1" }
    ])
});
module.exports = router;