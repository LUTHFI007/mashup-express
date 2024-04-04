var express = require('express');
var router = express.Router();
const Product = require('../models/productsModel');
const nodemailer = require('nodemailer');

//Import the required packages for pdf generation
const puppeteer = require('puppeteer');
const ejs = require('ejs'); // Import EJS library
const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

router.get('/generate-pdf/:id', async (req, res) => {
  try {
      const productId = req.params.id;

      // Fetch product data from your database (replace this with your logic)
      const product = await Product.findById(productId);

      // Read the EJS template file
      const template = await readFileAsync('./views/product/product_pdf_template.ejs', 'utf8');

      // Render the EJS template with product data
      const html = ejs.render(template, { product });

      // Create a new Puppeteer browser instance
      const browser = await puppeteer.launch({ headless: 'new' }); // Pass headless: 'new'

      const page = await browser.newPage();

      // Set the content of the page
      await page.setContent(html);

      // Generate PDF
      const pdfBuffer = await page.pdf();

      // Close the Puppeteer browser
      await browser.close();

      // Set the response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${product.name}.pdf"`);

      // Send the PDF buffer as the response
      res.send(pdfBuffer);

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/send_product_email/:id', async (req, res) => {
  try {
    // Assuming you have a Product model or equivalent
    const product = await Product.findById(req.params.id);


    // Create a nodemailer transport object
    // replace this with your copied code
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "5a131923b06a91",
        pass: "bbdf883dd6b42f"
      }
    });

    const template = await readFileAsync('./views/product/product_email.ejs', 'utf8');
    // Email content
    const mailOptions = {
      from: 'user123@gmail.com', // Sender email address
      to: 'your_mailtrap_inbox@mailtrap.io', // Receiver email address
      subject: `New Product: ${product.name}`, // Email subject
      html: ejs.render(template, { product }) // Render HTML using EJS
    };


    // Send the email
    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.response);


    // Close the transport after sending the email
    transport.close();


    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/create_product', (req,res)=>{
    res.render('./product/create', {error: null});
});

router.post('/create_product', (req, res) => {
    const { name, description, price } = req.body;
    const product = new Product({
        name,
        description,
        price
    });
    const validationError = product.validateSync();
    if (validationError) {
        res.render('./product/create', { error: validationError.errors});
    } else {
        product.save().then(() => {
                res.redirect('/');
            }).catch((error) => {
                console.error(error);
                
            });
   }
});

router.get('/retrieve_product', (req, res) => {

    Product.find().then(data => {
      res.render('./product/retrieve',{data:data})
  
    }).catch(error => {
  
      console.error(error);
      
    });
  
});

router.get('/update_product/:id',(req , res) =>{
  const productId = req.params.id;
 Product.findById(productId).lean().then(product =>{
      res.render('./product/update',{product:product,error: null
})
  }).catch(error => {
      console.error(error);
    });
})

router.post('/update_product/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, price } = req.body;
    const product = new Product({ name, description, price })
    const validationError = product.validateSync();
    if (validationError) {
        // If there are validation errors, re-render the form with error messages
    res.render('./product/update', {product:product, error: validationError.errors});


    } else {
    Product.findByIdAndUpdate(
        productId,
        { name, description, price }
      )
        .then(() => {
          res.redirect('/products/retrieve_product'); // Redirect to the product list after updating
        })
        .catch(error => {
          console.error(error);
        });
    }
});

router.get('/delete_product/:id',(req , res) =>{
  const productId = req.params.id;
 Product.findById(productId).then(product =>{
      res.render('./product/delete',{product:product})
  }).catch(error => {
      console.error(error);
    });
})

router.post('/delete_product/:id',(req, res) =>{
    const productId = req.params.id;
    Product.findByIdAndDelete(productId)
        .then(() => {
          res.redirect('/products/retrieve_product'); // Redirect to the product list after deleting
        })
        .catch(error => {
          console.error(error);
        });
});

router.get('/listing_page', (req, res) => {
  const { page = 1, limit = 3 } = req.query; // Set default page and limit

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  Product.paginate({}, options)
    .then(result => {
      res.render('product/list', { products: result.docs, pagination: result });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

// // Route to handle page visit
router.get('/pagevisit', (req, res) =>{
  // Get the current count from the session, or set it to 0 if it doesn't exist
  const count = req.session.page_count || 0;
  
  // Increment the count
  req.session.page_count = count + 1;

  // Render the template with the count variable
  res.render('product/page_view', { count: req.session.page_count });
});

module.exports = router;