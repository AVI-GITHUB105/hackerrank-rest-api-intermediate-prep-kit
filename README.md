# HackerRank REST API Intermediate Certification Prep Guide 🚀

A structured, hands-on study guide and code architecture blueprint designed to master data aggregation, query manipulation, and low-memory execution traps on automated technical platforms.

## 🌐 Core Concepts Covered
* **Consuming Endpoints:** Asynchronous processing (`async/await`) paired with strict response gatekeeping (`if (!response.ok)`).
* **Server-Side Filtering:** Offloading database overhead directly to query strings (`?search=X&category=Y`) to bypass execution timeouts.
* **Offset Pagination:** Managing infinite data streams by dynamically extracting metadata boundaries (`totalPages`, `total`).
* **Environment Workarounds:** Swapping out native browser `fetch` for `axios` or native Node `https` drivers to prevent WebAssembly container crashes.

## 📂 File Directory & Problem Blueprints
* `/01-football-matches-draw-counts-axios.js` -> Optimizing sequential scores using server filtering.(https://github.com/AVI-GITHUB105/hackerrank-rest-api-intermediate-prep-kit/blob/main/01-football-matches-draw-counts-axios.js)
* `/02-team-goals-accumulation-while-loop.js` -> Multi-page data parsing across separate home/away blocks.(https://github.com/AVI-GITHUB105/hackerrank-rest-api-intermediate-prep-kit/blob/main/02-team-goals-accumulation-while-loop.js)

---

## 📖 Intermediate API Concepts & Playbook

### 1. Consuming an API (The Foundation)
Consuming an API means using JavaScript's native execution tools to make an asynchronous HTTP network request to a remote server, waiting for the server to reply, and converting that raw data stream into a usable JavaScript object.

```javascript
async function fetchSingleProduct(productId) {
    const url = `https://api.freeapi.app/api/v1/public/products/${productId}`;
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const payload = await response.json();
        return payload.data; 
    } catch (error) {
        console.error("Fetch failed:", error.message);
        return null;
    }
}


2. Filtering & Searching
Instead of downloading every single piece of data and filtering it inside your JavaScript code using array methods (which causes major performance issues and test timeouts), you pass keys and values inside the URL query string to tell the server to filter the database before sending it to you.
* Searching: Uses query parameters like ?search=mouse or ?q=laptop to match text across fields.

* Filtering: Uses specific key-value keys like ?category=electronics or ?price=50 to pinpoint exact constraints.

```JavaScript
async function searchElectronics(searchTerm) {
    const url = `https://api.freeapi.app/api/v1/public/products?category=electronics&search=${searchTerm}`;
    
    try {
        const response = await fetch(url);
        const payload = await response.json();
        return payload.data.data; 
    } catch (error) {
        return [];
    }
}


3. Sorting (Single & Multi-Column)
Sorting tells the API server the exact order in which you want the records returned (e.g., lowest price first, or newest items first).

* Single Sorting: Typically uses query parameters like ?sortBy=price&order=asc.

* Multi-Column Sort: Advanced APIs allow you to sort by multiple conditions simultaneously using comma-separated lists like ?sort=category,price&order=asc,desc.

async function getSortedInventory(sortColumn, sortOrder) {
    const url = `https://api.freeapi.app/api/v1/public/products?sortBy=${sortColumn}&order=${sortOrder}`;
    
    try {
        const response = await fetch(url);
        const payload = await response.json();
        return payload.data.data;
    } catch (error) {
        return [];
    }
}


4. Pagination (Offset-Based)An API server cannot send thousands of items in a single response without crashing your application. It uses Offset Pagination to break the data down into pages.
* page: The current index chunk you want to look at (Page 1, Page 2, etc.).
* limit (or per_page): How many records should exist inside that single page chunk.
$$\text{Offset} = (\text{page} - 1) \times \text{limit}$$

async function getInventoryPage(pageNumber, itemsPerPage) {
    const url = `https://api.freeapi.app/api/v1/public/products?page=${pageNumber}&limit=${itemsPerPage}`;
    
    try {
        const response = await fetch(url);
        const payload = await response.json();
        
        return {
            items: payload.data.data,
            totalPages: payload.data.totalPages,
            hasNextPage: payload.data.hasNextPage
        };
    } catch (error) {
        return { items: [], totalPages: 1, hasNextPage: false };
    }
}

5. Combined Parameter Construction Challenge
A complete example showing how to construct a combined request matching multiple criteria: search term, sorting properties, explicit page parameters, and maximum limits in a single template literal payload pipeline.

async function getPremiumLaptops(pageNumber) {
    const baseURL = "[https://api.freeapi.app/api/v1/public/products](https://api.freeapi.app/api/v1/public/products)";
    const url = `${baseURL}?search=laptop&sortBy=price&order=desc&page=${pageNumber}&limit=5`;

    try {
        const response = await fetch(url);
        if (!response.ok) return [];
        
        const payload = await response.json();
        return payload.data.data; 
    } catch (error) {
        console.error(error);
        return [];
    }
}
