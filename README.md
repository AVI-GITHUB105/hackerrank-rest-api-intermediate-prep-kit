# HackerRank REST API Intermediate Certification Prep Guide 🚀

A structured, hands-on study guide and code architecture blueprint designed to master data aggregation, query manipulation, and low-memory execution traps on automated technical platforms.

## 🌐 Core Concepts Covered
* **Consuming Endpoints:** Asynchronous processing (`async/await`) paired with strict response gatekeeping (`if (!response.ok)`).
* **Server-Side Filtering:** Offloading database overhead directly to query strings (`?search=X&category=Y`) to bypass execution timeouts.
* **Offset Pagination:** Managing infinite data streams by dynamically extracting metadata boundaries (`totalPages`, `total`).
* **Environment Workarounds:** Swapping out native browser `fetch` for `axios` or native Node `https` drivers to prevent WebAssembly container crashes.

## 📂 File Directory & Problem Blueprints
- [/01-football-matches-draw-counts-axios.js](https://github.com/AVI-GITHUB105/hackerrank-rest-api-intermediate-prep-kit/blob/main/01-football-matches-draw-counts-axios.js) -> Optimizing sequential scores using server filtering.
- [/02-team-goals-accumulation-while-loop.js](https://github.com/AVI-GITHUB105/hackerrank-rest-api-intermediate-prep-kit/blob/main/02-team-goals-accumulation-while-loop.js) -> Multi-page data parsing across separate home/away blocks.
- [/03-football-competition-winners-goals.js](https://github.com/AVI-GITHUB105/hackerrank-rest-api-intermediate-prep-kit/blob/main/03-football-competition-winners-goals.js) -> URL sanitization and dependent multi-endpoint orchestration.
- [/04-medical-records-average-pulse.js](https://github.com/AVI-GITHUB105/hackerrank-rest-api-intermediate-prep-kit/blob/main/04-medical-records-average-pulse.js) -> Deep nested child extraction and division-by-zero math guards.

---

## 📖 Intermediate API Concepts & Playbook
Let’s break down each of these core REST API concepts one by one. This is the exact playbook you need to handle how HackerRank expects you to manipulate data parameters on an intermediate exam.

### 1. Consuming an API (The Foundation)
Consuming an API means using JavaScript's native execution tools to make an asynchronous HTTP network request to a remote server, waiting for the server to reply, and converting that raw data stream into a usable JavaScript object.

🛠️ Code Example

 ```javascript
async function fetchSingleProduct(productId) {
    const url = `https://api.freeapi.app/api/v1/public/products/${productId}`;
    try {
        const response = await fetch(url);
        
        // Defensive check: Did the server return a 200 OK status?
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const payload = await response.json();
        return payload.data; // Return the inner data object
    } catch (error) {
        console.error("Fetch failed:", error.message);
        return null;
    }
}
`````

###2. Filtering & Searching
Instead of downloading every single piece of data and filtering it inside your JavaScript code using array methods (which causes major performance issues and test timeouts), you pass keys and values inside the URL query string to tell the server to filter the database before sending it to you.

* Searching: Uses query parameters like ?search=mouse or ?q=laptop to match text across fields.

* Filtering: Uses specific key-value keys like ?category=electronics or ?price=50 to pinpoint exact constraints.

🛠️ Code Example

```JavaScript
async function searchElectronics(searchTerm) {
    // Combining searching and filtering parameters together using '&'
    const url = `https://api.freeapi.app/api/v1/public/products?category=electronics&search=${searchTerm}`;
    
    try {
        const response = await fetch(url);
        const payload = await response.json();
        return payload.data.data; // Returns only the matching electronics array
    } catch (error) {
        return [];
    }
}
`````

###3. Sorting (Single & Multi-Column)
Sorting tells the API server the exact order in which you want the records returned (e.g., lowest price first, or newest items first).

* Single Sorting: Typically uses query parameters like ?sortBy=price&order=asc.

* Multi-Column Sort: Advanced APIs allow you to sort by multiple conditions simultaneously using comma-separated lists like ?sort=category,price&order=asc,desc.
  
🛠️ Code Example

```JavaScript
async function getSortedInventory(sortColumn, sortOrder) {
    // Example: sortColumn = "price", sortOrder = "desc"
    const url = `https://api.freeapi.app/api/v1/public/products?sortBy=${sortColumn}&order=${sortOrder}`;
    
    try {
        const response = await fetch(url);
        const payload = await response.json();
        return payload.data.data;
    } catch (error) {
        return [];
    }
}

`````
###4. Pagination (Offset-Based)An API server cannot send thousands of items in a single response without crashing your application. It uses Offset Pagination to break the data down into pages.
   You control offset pagination using two fundamental query parameters:
* page: The current index chunk you want to look at (Page 1, Page 2, etc.).
* limit (or per_page): How many records should exist inside that single page chunk.
$$\text{Offset} = (\text{page} - 1) \times \text{limit}$$

🛠️ Code Example

```JavaScript
async function getInventoryPage(pageNumber, itemsPerPage) {
    const url = `https://api.freeapi.app/api/v1/public/products?page=${pageNumber}&limit=${itemsPerPage}`;
    
    try {
        const response = await fetch(url);
        const payload = await response.json();
        
        // Always examine the structural metadata returned alongside the data array!
        return {
            items: payload.data.data,
            totalPages: payload.data.totalPages,
            hasNextPage: payload.data.hasNextPage
        };
    } catch (error) {
        return { items: [], totalPages: 1, hasNextPage: false };
    }
}
`````

**🏋️ Practice Task: Pulling It All Together**
Let's test your ability to construct a clean, combined query string.

The Problem
Write an asynchronous function getPremiumLaptops(pageNumber) that fetches data from the freeapi.app public products endpoint. It must look for items matching these combined criteria via the URL parameters:

The search term must be "laptop".

The items must be sorted by "price" in "desc" (descending) order.

It should fetch the specific pageNumber passed into the function, with a strict limit of 5 items per page.

**🏋️Starter Template**

```JavaScript
async function getPremiumLaptops(pageNumber) {
    const baseURL = "https://api.freeapi.app/api/v1/public/products";
    
    // TODO: Construct the full URL string containing all 4 required query parameters
    const url = ``;

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

// --- TEST CASE ---
(async () => {
    // Should fetch the top 5 most expensive laptops on Page 1
    const luxuryLaptops = await getPremiumLaptops(1);
    console.log("Resulting Items:", luxuryLaptops);
})();
`````
**🛠️ The Complete Running Script**
```javascript
async function getPremiumLaptops(pageNumber) {
    const baseURL = "https://api.freeapi.app/api/v1/public/products";
    
    // FIXED: Removed the extra / and the duplicate ? before sortBy
    const url = `${baseURL}?search=laptop&sortBy=price&order=desc&page=${pageNumber}&limit=5`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status}`);
            return [];
        }
        
        const payload = await response.json();
        return payload.data.data; 
    } catch (error) {
        console.error("Network error:", error);
        return [];
    }
}

// --- TEST CASE ---
(async () => {
    console.log("Requesting premium laptops...");
    const luxuryLaptops = await getPremiumLaptops(1);
    console.log("Resulting Items:", luxuryLaptops);
})();
````
### **A little star concept **
What is encodeURIComponent() and Why is it Used?
encodeURIComponent() is a built-in JavaScript function used to safely encode a string for use as part of a URL query string or parameter.

When you pass data into a URL (like a football competition name or a medical diagnosis), that data often contains special characters such as spaces, ampersands (&), question marks (?), or slashes (/). In a URL, these characters have special structural meanings:

A space ( ) can break the URL stream or get corrupted.

An ampersand (&) tells the server a new parameter is starting.

If a user or a test database searches for an item like "UEFA Champions League" (which has spaces) or "Plague & Fever" (which has an ampersand), pasting it raw into a template literal breaks the HTTP request format. encodeURIComponent() fixes this by turning those illegal characters into safe UTF-8 escape sequences (e.g., spaces become %20, & becomes %26).

In Which Files of Your Repository is it Used?
Based on your public repository, hackerrank-rest-api-intermediate-prep-kit, you have utilized this concept in two specific challenges to prevent runtime API breakage:

1. In 03-football-competition-winners-goals.js
Football competitions often have spaces in their names (e.g., "UEFA Champions League"). If you don't wrap them, the URL truncates at the first space.

```JavaScript
// From your repository file:
const url = `${baseurl1}?competition=${encodeURIComponent(competition)}&year=${year}&team1=${encodeURIComponent(winner)}&page=${page1}`;

// 💡 Real-World Transformation:
// If competition = "UEFA Champions League"
// Raw template literal:  .../api/football_matches?competition=UEFA Champions League&year=2011
// With encodeURIComponent: .../api/football_matches?competition=UEFA%20Champions%20League&year=2011
````

2. In 04-medical-records-average-pulse.js
Medical diagnoses frequently contain spaces or hyphens (e.g., "Pulmonary embolism"). Sanitizing this input ensures the request securely reaches the endpoint.

```JavaScript
// From your repository file:
const url = `${baseurl}?doctor.id=${doctor_id}&diagnosis.name=${encodeURIComponent(diagnosis_name)}&page=${page}`;

// 💡 Real-World Transformation:
// If diagnosis_name = "Pulmonary embolism"
// Becomes: ...&diagnosis.name=Pulmonary%20embolism&page=1
````

###Where It Is Not Needed
You do not need to use it on numbers (like year or page) or strict single-word alphanumeric strings, because those characters are already completely safe for standard URL pathing. Use it strictly on variables holding dynamic user inputs or strings containing potential whitespace and symbols!
