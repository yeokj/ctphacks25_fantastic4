import React from 'react';

const SelectRadius = ({ onRadiusChange, selectedRadius }) => {

  const radiusOptions = [5, 10, 15, 20, 25];

  return (
    <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg shadow-md w-fit">
      <label htmlFor="radius-select" className="text-base font-semibold text-gray-700 mb-1">
        Radius (miles)
      </label>
      <select
        id="radius-select"
        value={selectedRadius} 
        onChange={(e) => onRadiusChange(e.target.value)} 
        className="w-full p-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      >
        {}
        {radiusOptions.map(radius => (
          <option key={radius} value={radius}>
            {radius} miles
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectRadius;