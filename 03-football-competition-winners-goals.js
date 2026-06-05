/**
 * Challenge 03: Football Competition Winners Goals
 * Core Concepts Learned: URL Sanitization & Dependent Endpoint Orchestration.
 * * Optimization Highlights:
 * 1. String Sanitization: Utilizes encodeURIComponent() on query variables to safely
 * parse whitespaces/symbols (e.g., "UEFA Champions League") preventing raw HTTP request breakage.
 * 2. Sequential Dependent Calls: Fetches the winner name from Endpoint A first, then passes
 * the string value dynamically into separate Home/Away loops on Endpoint B.
 */
```javascript
const axios = require('axios').default;

async function getWinnerTotalGoals(competition, year) {
    const baseurl = "https://jsonmock.hackerrank.com/api/football_competitions";
    const baseurl1 = "https://jsonmock.hackerrank.com/api/football_matches";
    
    let winner = "";
    let totalgoals = 0;

    // --- PHASE 1: Fetching the Competition Winner (Endpoint A) ---
    try {
        const url = `${baseurl}?name=${encodeURIComponent(competition)}&year=${year}`;
        const response = await axios.get(url);
        const payload = response.data;
        
        if (payload.data && payload.data.length > 0) {
            winner = payload.data[0].winner; 
        } else {
            console.error("No competition data found.");
            return 0;
        }
    } catch (error) {
        console.error(`Network error while fetching winner: ${error.message}`);
        return 0; 
    }

    // --- PHASE 2: Accumulating Goals as Home Team (Endpoint B) ---
    let page1 = 1;
    let totalpages1 = 1;

    while (page1 <= totalpages1) {
        try {
            const url = `${baseurl1}?competition=${encodeURIComponent(competition)}&year=${year}&team1=${encodeURIComponent(winner)}&page=${page1}`;
            const response = await axios.get(url);
            const payload = response.data;
            
            totalpages1 = payload.total_pages;
            
            for (const match of payload.data) {
                totalgoals += Number(match.team1goals);
            }
        } catch (error) {
            console.error(`Error on team1 page ${page1}: ${error.message}`);
            break;
        }
        page1++;
    }

    // --- PHASE 3: Accumulating Goals as Away Team (Endpoint B) ---
    let page2 = 1;
    let totalpages2 = 1;

    while (page2 <= totalpages2) {
        try {
            const url = `${baseurl1}?competition=${encodeURIComponent(competition)}&year=${year}&team2=${encodeURIComponent(winner)}&page=${page2}`;
            const response = await axios.get(url);
            const payload = response.data;
            
            totalpages2 = payload.total_pages; 
            
            for (const match of payload.data) {
                totalgoals += Number(match.team2goals);
            }
        } catch (error) {
            console.error(`Error on team2 page ${page2}: ${error.message}`);
            break;
        }
        page2++;
    }

    return totalgoals;
}

// --- Local Validation Test Block ---
(async () => {
    console.log("Analyzing competition data...");
    const result = await getWinnerTotalGoals("UEFA Champions League", 2011);
    console.log("Total Goals Scored by Competition Winner (2011):", result);
})();
````
