var express = require('express');
var router = express.Router();

router.get('/', (req,res)=>{
    res.render('./contact/contact')
});

router.get('/form', (req,res)=>{
 res.render('./contact/contactForm')
})

module.exports = router;