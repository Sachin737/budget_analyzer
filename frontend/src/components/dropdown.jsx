import React, { useState } from 'react';

const DropdownWithAdd = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [customOption, setCustomOption] = useState('');
  const [options, setOptions] = useState([
    'milk',
    'perfumes',
    'non-veg'
  ]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCustomOptionChange = (event) => {
    setCustomOption(event.target.value);
  };

  const handleAddCustomOption = () => {
    if (customOption.trim() !== '') {
      setOptions([...options, customOption]);
      setCustomOption('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddCustomOption();
    }
  };

  return (
    <div className="mb-4">
      <select value={selectedOption} onChange={handleOptionChange} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full">
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
        <option value="add">Add Custom Option</option>
      </select>
      {selectedOption === 'add' && (
        <div className="mt-2 flex items-center">
          <input
            type="text"
            value={customOption}
            onChange={handleCustomOptionChange}
            onKeyUp={handleKeyPress}
            placeholder="Enter custom option"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 mr-2 block w-full"
          />
          <button onClick={handleAddCustomOption} className="px-4 py-2 bg-76ABAE text-white rounded-md">Add</button>
        </div>
      )}
    </div>
  );
};

export default DropdownWithAdd;
