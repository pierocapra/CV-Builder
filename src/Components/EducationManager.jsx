import React, { useState } from 'react';
import { useAuth } from '../Utils/AuthContext';
import { useCv } from '../Utils/cvHooks';
import Spinner from './Spinner';

export default function EducationManager({ onClose, existingEntry = null, index = null }) {
  const { user, saveData } = useAuth();
  const { education, setEducation } = useCv();
  const [isSaving, setIsSaving] = useState(false);

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

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = [...education];
      
      if (index !== null) {
        updated[index] = entry;
      } else {
        updated.push(entry);
      }

      if (user?.uid) {
        await saveData('education', updated);
      } else {
        localStorage.setItem('education', JSON.stringify(updated));
      }
      
      setEducation(updated);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div>
        <label htmlFor="school" className="block text-sm font-medium text-gray-700">
          School / University
        </label>
        <input
          type="text"
          name="school"
          id="school"
          placeholder="e.g. Stanford University"
          value={entry.school}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
          disabled={isSaving}
        />
      </div>
      <div>
        <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
          Degree
        </label>
        <input
          type="text"
          name="degree"
          placeholder="e.g. BA Hons"
          value={entry.degree}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          disabled={isSaving}
        />
      </div>
      <div>
        <label htmlFor="field" className="block text-sm font-medium text-gray-700">
          Field of Study
        </label>
        <input
          type="text"
          name="field"
          id="field"
          placeholder="e.g. Science"
          value={entry.field}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          disabled={isSaving}
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
          placeholder="e.g. Boston, Massachusetts"
          value={entry.location}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          disabled={isSaving}
        />
      </div>
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
          disabled={isSaving}
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
          disabled={isSaving}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        disabled={isSaving}
      >
        {isSaving ? <Spinner size="sm" color="white" /> : null}
        {index !== null ? 'Update Education' : 'Add Education'}
      </button>
    </form>
  );
}
  