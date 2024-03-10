function generateAuthString(password) {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const authString = CryptoJS.MD5(`${password}_${timestamp}`).toString();
    return authString;
}

async function makeRequest(action, params, password) {
    const authString = generateAuthString(password);
    const url = 'http://api.valantis.store:40000/';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': authString
        },
        body: JSON.stringify({ action, params })
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

window.onload = function() {
    displayProducts();
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    prevPageBtn.addEventListener('click', () => {
        const currentPage = parseInt(document.getElementById('pageIndicator').textContent.split(' ')[1]);
        if (currentPage > 1) {
            displayProducts(currentPage - 1); // Выводим предыдущую страницу товаров
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const currentPage = parseInt(document.getElementById('pageIndicator').textContent.split(' ')[1]);
        displayProducts(currentPage + 1); // Выводим следующую страницу товаров
    });
};



async function displayProducts(page = 1) {
    const itemsPerPage = 50;
    const offset = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;

    try {
        const ids = await makeRequest('get_ids', { offset, limit }, 'Valantis');
        const products = await makeRequest('get_items', { ids }, 'Valantis');

        const productsList = document.getElementById('products-list');
        productsList.innerHTML = ''; // Очищаем содержимое перед добавлением новых товаров

        const uniqueProducts = {}; // Объект для хранения уникальных товаров по идентификатору

        products.forEach(product => {
            // Проверяем, есть ли товар с таким идентификатором уже в списке уникальных товаров
            if (!uniqueProducts[product.id]) {
                uniqueProducts[product.id] = true; // Добавляем товар в список уникальных товаров
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <div>ID: ${product.id}</div>
                    <div>Название: ${product.product}</div>
                    <div>Цена: ${product.price}</div>
                    <div>Бренд: ${product.brand || 'Не указан'}</div>
                `;
                productsList.appendChild(productElement);
            }
        });

        // Обновляем индикатор страницы
        const pageIndicator = document.getElementById('pageIndicator');
        pageIndicator.textContent = `Страница ${page}`;

    } catch (error) {
        console.error('Failed to display products:', error);
    }
}














/*

async function displayProducts(page = 1) {
    const itemsPerPage = 50;
    const offset = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;

    try {
        const ids = await makeRequest('get_ids', { offset, limit }, 'Valantis');
        const products = await makeRequest('get_items', { ids }, 'Valantis');

        const productsList = document.getElementById('products-list');
        productsList.innerHTML = ''; // Очищаем содержимое перед добавлением новых товаров

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <div>ID: ${product.id}</div>
                <div>Название: ${product.product}</div>
                <div>Цена: ${product.price}</div>
                <div>Бренд: ${product.brand || 'Не указан'}</div>
            `;
            productsList.appendChild(productElement);
        });

        // Обновляем индикатор страницы
        const pageIndicator = document.getElementById('pageIndicator');
        pageIndicator.textContent = `Страница ${page}`;

    } catch (error) {
        console.error('Failed to display products:', error);
    }
}


*/