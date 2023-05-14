const express = require('express');
const authController = require('../controllers/auth');
const przelewController = require('../controllers/przelewy');

const router = express.Router();
          
router.post('/register', authController.register );

router.post('/login', authController.login );

router.get('/logout', authController.logout );

router.post('/transfer', przelewController.transfer);

router.post('/transfer2', przelewController.transfer2);

module.exports = router;