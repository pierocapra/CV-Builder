import React, { useState, useEffect } from 'react';

export default function AdditionalInfoManager() {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    hasDrivingLicense: false,
    summary: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('additionalInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('additionalInfo', JSON.stringify(formData));
    alert('Data saved locally!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="eligibleToWorkInUk"
              checked={formData.eligibleToWorkInUk}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Eligible to work in the UK</span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hasDrivingLicense"
              checked={formData.hasDrivingLicense}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Has Driving License</span>
          </label>
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <textarea
            name="summary"
            id="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="e.g. A highly motivated software developer with experience in React and Node.js..."
            className="border p-2 rounded w-full h-24"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}