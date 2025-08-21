const apiController = (
    function () {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/solar';
    
    console.log('Using API Base URL:', API_BASE_URL); // Debug log

    async function getSolarData(latitude, longitude) {
        try {
            const url = `${API_BASE_URL}/coordinates?lat=${latitude}&lng=${longitude}`;
            console.log('Fetching from:', url); // Debug log
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching solar data:', error);
            throw error;
        }
    }

    async function getPostalCode(postalCode) {
        try {
            const url = `${API_BASE_URL}/postal?postalCode=${postalCode}`;
            console.log('Fetching from:', url); // Debug log
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching postal data:', error);
            throw error;
        }
    }

    return { getSolarData, getPostalCode };
})();

export const { getSolarData, getPostalCode } = apiController;