const apiController = (
    function () {
    const client_id = import.meta.env.VITE_CLIENT_ID;
    const solar_power = import.meta.env.VITE_SOLAR_KEY;

    async function getSolarData(latitude, longitude) {
        const solar_response = await fetch(`https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&requiredQuality=HIGH&key=${solar_power}`);
        const data = await solar_response.json();
        return data;
    }

    async function getPostalCode(postalCode) {
        const response = await fetch(`https://solar.googleapis.com/v1/buildingInsights:findByPostalCode?postalCode=${postalCode}&requiredQuality=HIGH&key=${solar_power}`);
        const data = await response.json();
        return data; 
    }

    return { getSolarData, getPostalCode };
})();

export const { getSolarData, getPostalCode } = apiController;

