// var express = require('express');
// var router = express.Router();
// const Product = require('../models/productsModel'); //import productSchema

// router.get('/list_template', (req, res) => {
//     res.render('productAjax');
// });

// //create product

// router.post('/create_product', (req, res) => {
//     const { name, description, price } = req.body;
//     const product = new Product({
//         name,
//         description,
//         price
//     });
//     const validationError = product.validateSync();


//     if (validationError) {
//         return res.status(400).json({ error: validationError.errors });
//     }
//     product.save()
//         .then(() => {
//             res.status(201).json({ message: 'Product created successfully' });
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({ message: 'Server Error' });
//         });
// });