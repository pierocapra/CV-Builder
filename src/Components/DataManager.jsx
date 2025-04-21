import React, { useState, useEffect } from 'react';

export default function DataManager() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    location: '',
    dateOfBirth: '',
    hasDrivingLicense: false,
    summary: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('cvData');
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
    localStorage.setItem('cvData', JSON.stringify(formData));
    alert('Data saved locally!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="e.g. John"
            value={formData.firstName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="e.g. Doe"
            value={formData.lastName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="e.g. john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="e.g. +1234567890"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="e.g. 123 Main Street"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            City & Country
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g. New York, USA"
            value={formData.location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

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
