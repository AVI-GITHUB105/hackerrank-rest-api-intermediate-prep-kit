/**
 * Challenge 02: Total Goals Scored by a Team
 * Core Concept Learned: Multi-Page Pagination Loops & Parameter Isolation.
 * * Optimization: Using independent 'while' loops to safely separate matches 
 * where the target team played as the home team (team1) versus the away team (team2).
 * This structure prevents variable pollution and avoids URL filtering logic flaws.
 */

const axios = require('axios').default; // Appended .default to satisfy strict environments

async function getTotalGoals(team, year) {
    // Sanitize the input string to strip out hidden carriage returns (\r) or trailing spaces
    const cleanTeam = team.trim();
    const baseurl = "https://jsonmock.hackerrank.com/api/football_matches";
    let totalgoals = 0;

    // --- PART 1: Goals scored as Home Team (team1) ---
    let page1 = 1;
    let totalpages1 = 1; // Initial anchor to ensure the loop fires at least once

    while (page1 <= totalpages1) {
        try {
            const response = await axios.get(`${baseurl}?year=${year}&team1=${cleanTeam}&page=${page1}`);
            const payload = response.data; // Axios automatically parses incoming JSON strings
            
            // Dynamically update the true boundary constraint from server metadata
            totalpages1 = payload.total_pages; 
            
            // Accumulate the goals scored by team1 on this specific page chunk
            for (const match of payload.data) {
                totalgoals += Number(match.team1goals);
            }
        } catch (error) {
            console.error(`Page 1 Home Match processing error: ${error.message}`);
            break; // Terminate execution early if the endpoint fails completely
        }
        page1++;
    }

    // --- PART 2: Goals scored as Away Team (team2) ---
    let page2 = 1;
    let totalpages2 = 1;

    while (page2 <= totalpages2) {
        try {
            const response = await axios.get(`${baseurl}?year=${year}&team2=${cleanTeam}&page=${page2}`);
            const payload = response.data;
            
            totalpages2 = payload.total_pages;
            
            // Accumulate the goals scored by team2 on this specific page chunk
            for (const match of payload.data) {
                totalgoals += Number(match.team2goals);
            }
        } catch (error) {
            console.error(`Page 2 Away Match processing error: ${error.message}`);
            break;
        }
        page2++;
    }
 
    return totalgoals;
}

// --- Local Validation Test Block ---
(async () => {
    console.log("Processing match records...");
    const result = await getTotalGoals("Barcelona", 2011);
    console.log("Total Goals calculated for Barcelona in 2011 (Expected 35):", result);
})();
