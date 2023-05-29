const express = require('express');
const authController = require('../controllers/auth');
const przelewController = require('../controllers/przelewy');
const changeController = require('../controllers/datachange');
const router = express.Router();
          
router.post('/register', authController.register );

router.post('/login', authController.login );

router.get('/logout', authController.logout );

router.post('/transfer', przelewController.transfer);

router.post('/transfer2', przelewController.transfer2);

router.post('/datachange', changeController.datachange);

router.post('/datachangemail', changeController.datachange);
module.exports = router;