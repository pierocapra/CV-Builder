import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth';

export default function PersonalInfoManager({ onClose, personalInfo }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    phone: '',
  });

  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (personalInfo && Object.keys(personalInfo).length > 0) {
      setFormData(personalInfo);
    }
  }, [personalInfo]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      localStorage.setItem('personalInfo', JSON.stringify(formData));
    } else {
      try {
        const response = await fetch(
          `https://cv-builder-9a845-default-rtdb.europe-west1.firebasedatabase.app/personal-info/${currentUser.uid}.json`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
        return;
      }
    }

    onClose();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['firstName', 'lastName', 'email', 'address', 'city', 'country', 'phone'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              name={field}
              id={field}
              placeholder={`e.g. ${field === 'email' ? 'john@example.com' : field === 'phone' ? '+1234567890' : '...'}`}
              value={formData[field]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}

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
