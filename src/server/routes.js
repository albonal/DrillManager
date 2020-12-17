const express = require('express');
const router = express.Router();
const chipService = require('./chip/chip.service');


router.get('/chip/:mac', (req,res) => {
    chipService.getChip(req, res);
});

router.get('/chips', (req,res) => {
    chipService.getChips(req, res);
});

router.post('/chip',(req,res) => {
    chipService.postChip(req,res);
});

router.put('/chip/:mac', (req, res) => {
    chipService.updateChip(req, res);
  });

router.delete('/chip/:mac', (req, res) => {
    chipService.deleteChip(req, res);
  });

router.post('/turnOnLED',(req,res) => {
    chipService.turnOnLED(req,res);
});

router.post('/turnOffLED',(req,res) => {
    chipService.turnOffLED(req,res);
});

module.exports = router;