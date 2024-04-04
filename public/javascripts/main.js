 // Function to show the create form
 const showCreateForm = () => {
    const contentBox = document.getElementById('content-box');
    contentBox.innerHTML = `
        <div class="container">
            <h1>Create Products</h1>
            Product Name: <input type="text" id="name" name="name" required><br><br>
            Description: <textarea id="description" name="description" required></textarea><br><br>
            Price: <input type="number" id="price" name="price" min="0" required><br><br>
            <button type="button" onclick="createProduct()">Create Product</button>
        </div>
    `;


    // Hide the product list
    const productList = document.getElementById('product-table');
    productList.style.display = 'none';
};


// Function to handle form submission (create product)
const createProduct = () => {
    // Get form data
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;


    // Make an AJAX request to create a new product
    axios.post('/productAjax/create_product', {
        name,
        description,
        price
    })
    .then(response => {
        // Handle the response as needed (e.g., show success message)
        console.log('Product created successfully:', response.data);


        // Show the product list after successful creation
        getProductList();
    })
    .catch(error => {
        // Handle errors (e.g., display error message)
        console.error('Error creating product:', error.response.data);
    });
};
