const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
  res.render('index', {
    user: req.user
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('profile', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})

router.get('/admin',authController.isLoggedIn,(req, res) => {
  console.log(req.user);
  if( req.user.role == 'admin' ) {
    res.render('admin', {
      user: req.user
    });
  } else {
    res.redirect('/profile');
  }
  
})




router.get('/history', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('history', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})
module.exports = router;