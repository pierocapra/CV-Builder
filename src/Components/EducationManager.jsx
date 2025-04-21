import React, { useState } from 'react';

export default function EducationManager({ onClose, existingEntry = null, index = null }) {
    const [entry, setEntry] = useState(
      existingEntry || {
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        location: '',
      }
    );
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEntry((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const stored = JSON.parse(localStorage.getItem('education')) || [];
  
      if (index !== null) {
        stored[index] = entry; // update
      } else {
        stored.push(entry); // add new
      }
  
      localStorage.setItem('education', JSON.stringify(stored));
      onClose();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                School / University
            </label>
            <input type="text" name="school" id="school" placeholder="e.g. Stanford University" value={entry.school} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>
        <div>
            <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                Degree
            </label>
            <input type="text" name="degree" placeholder="e.g. BA Hons" value={entry.degree} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
            <label htmlFor="field" className="block text-sm font-medium text-gray-700">
                Field of Study
            </label>
            <input type="text" name="field" id="field" placeholder="e.g. Science" value={entry.field} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
            </label>
            <input type="text" name="location" id="location" placeholder="e.g. Boston, Massachussets" value={entry.location} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                </label>
                <input type="date" name="startDate" id="startDate" value={entry.startDate} onChange={handleChange} className="border p-2 rounded w-full" />
                </div>
            <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                </label>
                <input type="date" name="endDate" id="endDate" value={entry.endDate} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {index !== null ? 'Update Education' : 'Add Education'}
        </button>
      </form>
    );
  }
  