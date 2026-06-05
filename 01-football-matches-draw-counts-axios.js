/**
 * Challenge 01: Number of Drawn Matches
 * * Core Concept Learned: Server-Side Query Filtering & Payload Tallying.
 * Optimization: Bypassing execution timeout traps by filtering goal counts
 * directly on the server instead of executing hundreds of sequential page lookups.
 */

const axios = require('axios').default; // Safely configured for strict linters

async function getNumDraws(year) {
    const baseurl = "https://jsonmock.hackerrank.com/api/football_matches";
    let totalDraws = 0;

    // Loop directly through all possible drawn match score lines (0-0 up to 10-10)
    // defined by the platform constraint rules.
    for (let goals = 0; goals <= 10; goals++) {
        try {
            // Leverage server-side filtering by passing both goal targets in the URL parameters
            const url = `${baseurl}?year=${year}&team1goals=${goals}&team2goals=${goals}&page=1`;
            
            const response = await axios.get(url);
            const payload = response.data; // Axios handles automatic JSON parsing natively
            
            // Optimization Shortcut: payload.total yields the pre-calculated aggregate count 
            // of all matches matching this score across the database instantly.
            if (payload && payload.total !== undefined) {
                totalDraws += payload.total;
            }

        } catch (error) {
            console.error(`Error fetching data for scoreline ${goals}-${goals}:`, error.message);
        }
    }

    return totalDraws;
}

// --- Local Validation Test Block ---
(async () => {
    const result = await getNumDraws(2011);
    console.log("Total Draws calculated for 2011 (Expected 516):", result);
})();
