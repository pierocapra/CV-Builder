import React, { useState } from 'react';

export default function WorkExperienceManager({ onClose, existingEntry = null, index = null }) {
    const [entry, setEntry] = useState(
      existingEntry || {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      }
    );
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEntry((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const stored = JSON.parse(localStorage.getItem('workExperience')) || [];
  
      if (index !== null) {
        stored[index] = entry; // Update
      } else {
        stored.push(entry); // Add new
      }
  
      localStorage.setItem('workExperience', JSON.stringify(stored));
      onClose();
    };
  
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Job Title"
            value={entry.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
      
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            placeholder="Company"
            value={entry.company}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
      
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Location"
            value={entry.location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={entry.startDate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={entry.endDate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="What did you do?"
            value={entry.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {index !== null ? 'Update Experience' : 'Add Experience'}
        </button>
      </form>      
    );
  }
  