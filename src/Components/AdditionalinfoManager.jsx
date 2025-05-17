import React, { useState, useEffect } from 'react';
import { useAuth } from '../Utils/AuthContext';
import { useCv } from '../Utils/CvContext';

export default function AdditionalInfoManager({ onClose }) {
  const { user, saveData } = useAuth();
  const { additionalInfo, setAdditionalInfo } = useCv();

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    eligibleToWorkInUk: false,
    hasDrivingLicense: false,
    summary: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
      setFormData(additionalInfo);
    }
  }, [additionalInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        await saveData('additionalInfo', formData);
      } else {
        localStorage.setItem('additionalInfo', JSON.stringify(formData));
      }
      setAdditionalInfo(formData);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Additional Information</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
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