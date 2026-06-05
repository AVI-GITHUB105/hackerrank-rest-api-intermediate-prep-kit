/**
 * Challenge 04: Medical Records Average Pulse
 * Core Concepts Learned: Deep Object Extraction & Zero-Division Edge Case Guards.
 * * Optimization Highlights:
 * 1. Deep Nested Property Parsing: Accesses sub-layer object paths (`record.vitals.pulse`)
 * safely while handling primitive data type alignment out of standard API streams.
 * 2. Mathematical Boundary Protection: Implements a ternary conditional safety check 
 * (`pulsecount === 0 ? 0 : ...`) to prevent accidental Division-by-Zero errors (NaN output).
 */

const axios = require('axios').default;

async function getAveragePulse(doctor_id, diagnosis_name) {
    const baseurl = "https://jsonmock.hackerrank.com/api/medical_records";
    let pulsecount = 0;
    let page = 1;
    let totalpage = 1;
    let totalpulse = 0;

    while (page <= totalpage) {
        try {
            // Dot-notation query keys (?doctor.id=X) are passed safely within the template stream
            const url = `${baseurl}?doctor.id=${doctor_id}&diagnosis.name=${encodeURIComponent(diagnosis_name)}&page=${page}`;
            const response = await axios.get(url);
            const payload = response.data;
            
            totalpage = payload.total_pages;
            
            for (const record of payload.data) {
                // Accessing the nested child property path
                const pulse = Number(record.vitals.pulse);
                totalpulse += pulse;
                pulsecount++;
            }
        } catch (error) {
            console.error(`Network or parsing error on page ${page}: ${error.message}`);
            break;
        }
        page++;
    }

    // Mathematical safety check: Prevents structural runtime drops if array counts match zero
    return pulsecount === 0 ? 0 : Math.floor(totalpulse / pulsecount);
}

// --- Local Validation Test Block ---
(async () => {
    console.log("Calculating average clinical vitals...");
    const avgPulse = await getAveragePulse(2, "Pulmonary embolism");
    console.log("Calculated Average Pulse for Doctor ID 2:", avgPulse);
})();
