const API_URL = 'https://crudcrud.com/api/92b6af1c4e8447e5b96493d105334ea9/product_details';

let products = [];
let editProductId = null;

function capitalizeFirstLetter(value) {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

async function fetchProducts() {
    try {
        const response = await axios.get(API_URL);
        products = response.data;
        display(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function store() {
    const priceInput = document.getElementById('price');
    const productNameInput = document.getElementById('product_name');
    const categoryInput = document.getElementById('category');

    const price = priceInput.value.trim();
    let product_name = productNameInput.value.trim();
    const category = categoryInput.value;

    if (!price) {
        alert('Please fill all fields');
        priceInput.focus();
        return;
    }
    if (!product_name) {
        alert('Please fill all fields');
        productNameInput.focus();
        return;
    }
    if (!category) {
        alert('Please fill all fields');
        categoryInput.focus();
        return;
    }

    product_name = capitalizeFirstLetter(product_name);
    productNameInput.value = product_name;

    const newProduct = { price, product_name, category };

    try {
        if (editProductId) {
            await axios.put(`${API_URL}/${editProductId}`, newProduct);
            editProductId = null;
            document.getElementById('submitBtn').innerText = 'Add Product';
        } else {
            await axios.post(API_URL, newProduct);
        }

        priceInput.value = '';
        productNameInput.value = '';
        categoryInput.value = 'electronics';

        fetchProducts();
    } catch (error) {
        console.error('Error saving product:', error);
    }
}

function editProduct(id) {
    const product = products.find(p => p._id === id);
    if (!product) return;

    document.getElementById('price').value = product.price;
    document.getElementById('product_name').value = product.product_name;
    document.getElementById('category').value = product.category;

    editProductId = id;
    document.getElementById('submitBtn').innerText = 'Update Product';
}

async function remove(id) {
    try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

function filterProducts() {
    const nameValue = document.getElementById('filter_name').value.trim().toLowerCase();
    const priceValue = document.getElementById('filter_price').value;
    const categoryValue = document.getElementById('filter_category').value;

    const filtered = products.filter(product => {
        const matchesName =
            !nameValue || product.product_name.toLowerCase().includes(nameValue);

        const matchesPrice =
            !priceValue || parseFloat(product.price) <= parseFloat(priceValue);

        const matchesCategory =
            !categoryValue || product.category === categoryValue;

        return matchesName && matchesPrice && matchesCategory;
    });

    display(filtered);
}

function clearFilter() {
    document.getElementById('filter_name').value = '';
    document.getElementById('filter_price').value = '';
    document.getElementById('filter_category').value = '';
    display(products);
}

function display(productsArray) {
    document.getElementById('container1').innerHTML = '';
    document.getElementById('container2').innerHTML = '';
    document.getElementById('container3').innerHTML = '';

    const electronics = productsArray.filter(p => p.category === 'electronics');
    const health = productsArray.filter(p => p.category === 'health');
    const skinCare = productsArray.filter(p => p.category === 'skin_care');

    const render = (product, containerId) => {
        const li = document.createElement('li');
        li.className = 'product-row';

        li.innerHTML = `
            <span class="product-text">${product.product_name}</span>
            <span class="product-text">${product.price}/- INR</span>
            <span class="product-actions">
                <button class="edit-btn" onclick="editProduct('${product._id}')">Edit</button>
                <button onclick="remove('${product._id}')">Delete</button>
            </span>`;
        document.getElementById(containerId).appendChild(li);
    };

    electronics.forEach(p => render(p, 'container1'));
    health.forEach(p => render(p, 'container2'));
    skinCare.forEach(p => render(p, 'container3'));

    const totalProducts = electronics.length + health.length + skinCare.length;
    document.querySelector('h2').innerHTML = `Products: (${totalProducts} items)`;
}

document.addEventListener('DOMContentLoaded', fetchProducts);
