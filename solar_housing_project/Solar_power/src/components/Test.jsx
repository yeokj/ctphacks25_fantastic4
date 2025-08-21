import React, { useState, useRef } from 'react';
import { getSolarData, getPostalCode } from '../API/solar_power.js';

function Test() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stationResults, setStationResults] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [customLocation, setCustomLocation] = useState({ lat: '', lng: '', name: '' });
    const [selectedCategory, setSelectedCategory] = useState('train_stations');
    const [customLocations, setCustomLocations] = useState([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const fileInputRef = useRef(null);

    // Dynamic location categories
    const locationCategories = {
        train_stations: {
            name: "🚂 Train Stations",
            locations: [
                { name: "Grand Central Terminal", lat: 40.7527, lng: -73.9772, city: "NYC" },
                { name: "Penn Station", lat: 40.7505, lng: -73.9934, city: "NYC" },
                { name: "Union Station DC", lat: 38.8975, lng: -77.0067, city: "Washington DC" },
                { name: "South Station Boston", lat: 42.3519, lng: -71.0552, city: "Boston" },
                { name: "Union Station Chicago", lat: 41.8789, lng: -87.6359, city: "Chicago" },
                { name: "King Street Station", lat: 47.5988, lng: -122.3301, city: "Seattle" },
                { name: "Union Station LA", lat: 34.0560, lng: -118.2368, city: "Los Angeles" },
                { name: "30th Street Station", lat: 39.9566, lng: -75.1827, city: "Philadelphia" }
            ]
        },
        airports: {
            name: "✈️ Major Airports",
            locations: [
                { name: "JFK Airport", lat: 40.6413, lng: -73.7781, city: "NYC" },
                { name: "LAX Airport", lat: 33.9425, lng: -118.4081, city: "Los Angeles" },
                { name: "O'Hare Airport", lat: 41.9742, lng: -87.9073, city: "Chicago" },
                { name: "Miami Airport", lat: 25.7617, lng: -80.1918, city: "Miami" },
                { name: "Denver Airport", lat: 39.8561, lng: -104.6737, city: "Denver" },
                { name: "Seattle Airport", lat: 47.4502, lng: -122.3088, city: "Seattle" }
            ]
        },
        universities: {
            name: "🎓 Universities",
            locations: [
                { name: "Harvard University", lat: 42.3770, lng: -71.1167, city: "Cambridge, MA" },
                { name: "Stanford University", lat: 37.4275, lng: -122.1697, city: "Stanford, CA" },
                { name: "MIT", lat: 42.3601, lng: -71.0942, city: "Cambridge, MA" },
                { name: "UCLA", lat: 34.0689, lng: -118.4452, city: "Los Angeles, CA" },
                { name: "University of Texas", lat: 30.2849, lng: -97.7341, city: "Austin, TX" },
                { name: "University of Washington", lat: 47.6587, lng: -122.3095, city: "Seattle, WA" }
            ]
        },
        shopping_centers: {
            name: "🛍️ Shopping Centers",
            locations: [
                { name: "Mall of America", lat: 44.8548, lng: -93.2422, city: "Bloomington, MN" },
                { name: "West Edmonton Mall", lat: 53.5224, lng: -113.6234, city: "Edmonton, AB" },
                { name: "Del Amo Fashion Center", lat: 33.8641, lng: -118.3401, city: "Torrance, CA" },
                { name: "King of Prussia Mall", lat: 40.0899, lng: -75.3865, city: "King of Prussia, PA" },
                { name: "South Coast Plaza", lat: 33.6906, lng: -117.8897, city: "Costa Mesa, CA" }
            ]
        },
        custom: {
            name: "📍 Custom Locations",
            locations: customLocations
        }
    };

    const testCoordinates = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Testing getSolarData with NYC coordinates...');
            const data = await getSolarData(40.7128, -74.0060);
            console.log('Coordinate data:', data);
            setResults({ type: 'coordinates', data });
        } catch (err) {
            console.error('API Test Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const testPostalCode = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Testing getPostalCode with NYC postal code...');
            const data = await getPostalCode("10001");
            console.log('Postal data:', data);
            setResults({ type: 'postal', data });
        } catch (err) {
            console.error('API Test Error:', err);
            
            if (err.message.includes('404') || err.message.includes('Not Found')) {
                setError('Postal code lookup is not available in this region. Please use the coordinates option instead.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const addCustomLocation = () => {
        if (customLocation.lat && customLocation.lng && customLocation.name) {
            const newLocation = {
                name: customLocation.name,
                lat: parseFloat(customLocation.lat),
                lng: parseFloat(customLocation.lng),
                city: "Custom Location"
            };
            
            setCustomLocations(prev => [...prev, newLocation]);
            setCustomLocation({ lat: '', lng: '', name: '' });
        }
    };

    const removeCustomLocation = (index) => {
        setCustomLocations(prev => prev.filter((_, i) => i !== index));
    };

    const analyzeLocations = async () => {
        const selectedLocations = locationCategories[selectedCategory].locations;
        
        if (selectedLocations.length === 0) {
            setError('No locations to analyze in the selected category.');
            return;
        }

        setAnalyzing(true);
        setError(null);
        setStationResults([]);
        setProgress({ current: 0, total: selectedLocations.length });
        
        const results = [];
        
        try {
            console.log(`Analyzing solar potential for ${locationCategories[selectedCategory].name}...`);
            
            for (let i = 0; i < selectedLocations.length; i++) {
                const location = selectedLocations[i];
                setProgress({ current: i + 1, total: selectedLocations.length });
                
                try {
                    console.log(`Fetching data for ${location.name}...`);
                    const data = await getSolarData(location.lat, location.lng);
                    
                    if (data.solarPotential) {
                        results.push({
                            location: location,
                            solarData: data,
                            score: calculateSolarScore(data.solarPotential),
                            success: true
                        });
                    }
                    
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (locationError) {
                    console.error(`Error for ${location.name}:`, locationError);
                    results.push({
                        location: location,
                        error: locationError.message,
                        success: false
                    });
                }
            }
            
            // Sort by solar score (highest to lowest)
            const successfulResults = results.filter(r => r.success);
            successfulResults.sort((a, b) => b.score - a.score);
            
            setStationResults(results);
            
        } catch (err) {
            console.error('Analysis Error:', err);
            setError(err.message);
        } finally {
            setAnalyzing(false);
            setProgress({ current: 0, total: 0 });
        }
    };

    const calculateSolarScore = (solarPotential) => {
        const maxPanels = solarPotential.maxArrayPanelsCount || 0;
        const maxArea = solarPotential.maxArrayAreaMeters2 || 0;
        const sunshineHours = solarPotential.maxSunshineHoursPerYear || 0;
        
        // Weighted score (you can adjust these weights)
        return (maxPanels * 0.4) + (maxArea * 0.3) + (sunshineHours * 0.3);
    };

    const getScoreColor = (score, allScores) => {
        if (allScores.length === 0) return '#666';
        const maxScore = Math.max(...allScores);
        const minScore = Math.min(...allScores);
        const percentage = (score - minScore) / (maxScore - minScore);
        
        if (percentage > 0.7) return '#4CAF50'; // Green for high
        if (percentage > 0.4) return '#FF9800'; // Orange for medium
        return '#F44336'; // Red for low
    };

    const exportResults = () => {
        const successfulResults = stationResults.filter(r => r.success);
        const csvContent = [
            ['Rank', 'Name', 'City', 'Latitude', 'Longitude', 'Score', 'Max Panels', 'Max Area (m²)', 'Sunshine Hours/Year'],
            ...successfulResults.map((result, index) => [
                index + 1,
                result.location.name,
                result.location.city,
                result.location.lat,
                result.location.lng,
                result.score.toFixed(2),
                result.solarData.solarPotential.maxArrayPanelsCount || 0,
                result.solarData.solarPotential.maxArrayAreaMeters2 || 0,
                result.solarData.solarPotential.maxSunshineHoursPerYear || 0
            ])
        ];

        const csvString = csvContent.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `solar-analysis-${selectedCategory}-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split('\n');
                const newLocations = [];
                
                for (let i = 1; i < lines.length; i++) { // Skip header
                    const [name, lat, lng, city] = lines[i].split(',');
                    if (name && lat && lng) {
                        newLocations.push({
                            name: name.trim(),
                            lat: parseFloat(lat.trim()),
                            lng: parseFloat(lng.trim()),
                            city: city ? city.trim() : 'Imported Location'
                        });
                    }
                }
                
                if (newLocations.length > 0) {
                    setCustomLocations(prev => [...prev, ...newLocations]);
                    setSelectedCategory('custom');
                }
            };
            reader.readAsText(file);
        }
    };

    const successfulStations = stationResults.filter(r => r.success);
    const allScores = successfulStations.map(r => r.score);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>Dynamic Solar Analysis Dashboard</h2>
            
            {/* Original test buttons */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Quick Tests</h3>
                <button 
                    onClick={testCoordinates} 
                    disabled={loading || analyzing}
                    style={{ 
                        marginRight: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading || analyzing) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Testing...' : 'Test Coordinates (NYC) ✅'}
                </button>
                
                <button 
                    onClick={testPostalCode} 
                    disabled={loading || analyzing}
                    style={{ 
                        backgroundColor: '#ff9800',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading || analyzing) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Testing...' : 'Test Postal Code (Limited) ⚠️'}
                </button>
            </div>

            {/* Dynamic Analysis Section */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                <h3>Dynamic Location Analysis</h3>
                
                {/* Category Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Select Location Category:
                    </label>
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ 
                            padding: '10px', 
                            borderRadius: '4px', 
                            border: '1px solid #ccc',
                            marginRight: '10px',
                            minWidth: '200px'
                        }}
                    >
                        {Object.entries(locationCategories).map(([key, category]) => (
                            <option key={key} value={key}>
                                {category.name} ({category.locations.length} locations)
                            </option>
                        ))}
                    </select>

                    <button 
                        onClick={analyzeLocations} 
                        disabled={loading || analyzing}
                        style={{ 
                            backgroundColor: '#2196F3',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (loading || analyzing) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {analyzing ? `Analyzing... (${progress.current}/${progress.total})` : `Analyze ${locationCategories[selectedCategory].name}`}
                    </button>
                </div>

                {/* Progress Bar */}
                {analyzing && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ 
                            backgroundColor: '#e0e0e0', 
                            borderRadius: '10px', 
                            height: '20px',
                            overflow: 'hidden'
                        }}>
                            <div style={{ 
                                backgroundColor: '#2196F3', 
                                height: '100%', 
                                width: `${(progress.current / progress.total) * 100}%`,
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                        <p style={{ margin: '5px 0', textAlign: 'center' }}>
                            Processing {progress.current} of {progress.total} locations...
                        </p>
                    </div>
                )}

                {/* Custom Location Input */}
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #ddd' }}>
                    <h4>Add Custom Location</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Location Name:</label>
                            <input
                                type="text"
                                value={customLocation.name}
                                onChange={(e) => setCustomLocation(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter location name"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Latitude:</label>
                            <input
                                type="number"
                                step="any"
                                value={customLocation.lat}
                                onChange={(e) => setCustomLocation(prev => ({ ...prev, lat: e.target.value }))}
                                placeholder="40.7128"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Longitude:</label>
                            <input
                                type="number"
                                step="any"
                                value={customLocation.lng}
                                onChange={(e) => setCustomLocation(prev => ({ ...prev, lng: e.target.value }))}
                                placeholder="-74.0060"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <button 
                            onClick={addCustomLocation}
                            style={{ 
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Location
                        </button>
                    </div>

                    {/* File Upload */}
                    <div style={{ marginTop: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Or upload CSV file (name,lat,lng,city):</label>
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ marginBottom: '10px' }}
                        />
                    </div>

                    {/* Custom Locations List */}
                    {customLocations.length > 0 && (
                        <div style={{ marginTop: '15px' }}>
                            <h5>Custom Locations ({customLocations.length}):</h5>
                            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {customLocations.map((loc, index) => (
                                    <div key={index} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '5px',
                                        backgroundColor: '#f9f9f9',
                                        marginBottom: '5px',
                                        borderRadius: '4px'
                                    }}>
                                        <span>{loc.name} ({loc.lat}, {loc.lng})</span>
                                        <button 
                                            onClick={() => removeCustomLocation(index)}
                                            style={{ 
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                padding: '2px 8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {error && (
                <div style={{ 
                    color: 'red', 
                    marginTop: '10px',
                    padding: '15px',
                    border: '1px solid red',
                    borderRadius: '4px',
                    backgroundColor: '#ffebee'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Results Export */}
            {stationResults.length > 0 && (
                <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                    <button 
                        onClick={exportResults}
                        style={{ 
                            backgroundColor: '#673AB7',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        📊 Export Results to CSV
                    </button>
                </div>
            )}

            {/* Analysis Results */}
            {stationResults.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>{locationCategories[selectedCategory].name} - Solar Analysis Results</h3>
                    <p>Locations ranked by solar potential (highest to lowest):</p>
                    
                    <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
                        {successfulStations.map((result, index) => (
                            <div key={result.location.name} style={{
                                border: '2px solid',
                                borderColor: getScoreColor(result.score, allScores),
                                borderRadius: '8px',
                                padding: '15px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, color: getScoreColor(result.score, allScores) }}>
                                        #{index + 1} {result.location.name}
                                    </h4>
                                    <div style={{
                                        backgroundColor: getScoreColor(result.score, allScores),
                                        color: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        Score: {result.score.toFixed(1)}
                                    </div>
                                </div>
                                
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    📍 {result.location.city} • ({result.location.lat}, {result.location.lng})
                                </p>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                                    <div>
                                        <strong>Max Panels:</strong> {result.solarData.solarPotential.maxArrayPanelsCount || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Max Area:</strong> {result.solarData.solarPotential.maxArrayAreaMeters2 || 'N/A'} m²
                                    </div>
                                    <div>
                                        <strong>Sunshine Hours/Year:</strong> {result.solarData.solarPotential.maxSunshineHoursPerYear || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Statistics */}
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                        <h4>Summary Statistics</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            <div>
                                <strong>🏆 Best Solar Potential:</strong><br/>
                                {successfulStations[0]?.location.name} ({successfulStations[0]?.location.city})
                            </div>
                            <div>
                                <strong>📉 Lowest Solar Potential:</strong><br/>
                                {successfulStations[successfulStations.length - 1]?.location.name} ({successfulStations[successfulStations.length - 1]?.location.city})
                            </div>
                            <div>
                                <strong>📊 Total Locations Analyzed:</strong><br/>
                                {successfulStations.length} successful / {stationResults.length} total
                            </div>
                            <div>
                                <strong>📈 Average Solar Score:</strong><br/>
                                {successfulStations.length > 0 ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Original single result display */}
            {results && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Single Location Results ({results.type}):</h3>
                    <div style={{ 
                        background: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '400px',
                        border: '1px solid #ddd'
                    }}>
                        {results.data.solarPotential && (
                            <div style={{ marginBottom: '15px' }}>
                                <h4>Solar Potential Summary:</h4>
                                <p><strong>Max Panels:</strong> {results.data.solarPotential.maxArrayPanelsCount}</p>
                                <p><strong>Max Area:</strong> {results.data.solarPotential.maxArrayAreaMeters2} m²</p>
                                <p><strong>Sunshine Hours/Year:</strong> {results.data.solarPotential.maxSunshineHoursPerYear}</p>
                                <p><strong>Building Location:</strong> {results.data.postalCode || 'N/A'}</p>
                            </div>
                        )}
                        
                        <details>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                View Raw Data
                            </summary>
                            <pre style={{ 
                                fontSize: '12px',
                                marginTop: '10px',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {JSON.stringify(results.data, null, 2)}
                            </pre>
                        </details>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Test;