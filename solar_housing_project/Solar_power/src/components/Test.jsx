// Example test in your React component or a separate test file
import { getSolarData, getPostalCode } from '../API/solar_power.js';

// Test function
async function testSolarAPI() {
    try {
        // Test 1: Using coordinates (no state/postal needed)
        console.log('Testing getSolarData with NYC coordinates...');
        const coordinateData = await getSolarData(40.7128, -74.0060);
        console.log('Coordinate data:', coordinateData);

        // Test 2: Using postal code (no state needed)
        console.log('Testing getPostalCode with NYC postal code...');
        const postalData = await getPostalCode("10001");
        console.log('Postal data:', postalData);

        // Test 3: Different locations
        const californiaData = await getPostalCode("90210"); // Beverly Hills
        console.log('California data:', californiaData);

    } catch (error) {
        console.error('API Test Error:', error);
    }
}

// Call the test
testSolarAPI();

export default Test; 
