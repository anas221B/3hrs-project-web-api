
const API_URL = 'https://crudcrud.com/api/d616ce63296a4cc1bc103e2ec9b9ccac/product_details';

let products = []; 
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
    const price = document.getElementById('price').value;
    const product_name = document.getElementById('product_name').value;
    const category = document.getElementById('category').value;

    if (!price || !product_name || !category) {
        alert('Please fill all fields');
        return;
    }

    const newProduct = { price: price,product_name: product_name,category: category};

    try {
        await axios.post(API_URL, newProduct);
        document.getElementById('price').value = '';
        document.getElementById('product_name').value = '';
        document.getElementById('category').value = '';
        fetchProducts(); 
    } catch (error) {
        console.error('Error adding product:', error);
    }
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
        const matchesName = !nameValue || 
            product.product_name.toLowerCase().includes(nameValue);
        
        const matchesPrice = !priceValue || 
            parseFloat(product.price) >= parseFloat(priceValue);
        
        const matchesCategory = !categoryValue || 
            product.category === categoryValue;

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
    
    electronics.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.price} - ${product.product_name} (${product.category}) 
                        <button onclick="remove('${product._id}')">Delete</button>`;
        document.getElementById('container1').appendChild(li);
    });
    
    health.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.price} - ${product.product_name} (${product.category}) 
                        <button onclick="remove('${product._id}')">Delete</button>`;
        document.getElementById('container2').appendChild(li);
    });
   
    skinCare.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.price} - ${product.product_name} (${product.category}) 
                        <button onclick="remove('${product._id}')">Delete</button>`;
        document.getElementById('container3').appendChild(li);
    });
    
    const totalProducts = productsArray.length;
    document.querySelector('h2').innerHTML = `Products: (${totalProducts} items)`;
}

document.addEventListener('DOMContentLoaded', fetchProducts);

