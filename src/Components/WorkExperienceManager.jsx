import React, { useState } from 'react';
import { useAuth } from '../Utils/AuthContext';
import { useCv } from '../Utils/cvHooks';
import Spinner from './Spinner';

export default function WorkExperienceManager({ onClose, existingEntry = null, index = null }) {
  const { user, saveData } = useAuth();
  const { workExperience, setWorkExperience } = useCv();
  const [isSaving, setIsSaving] = useState(false);

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

  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(existingEntry?.endDate === 'Present');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
    if (name === 'endDate' && value !== 'Present') {
      setCurrent(false);
    }
  };

  const handleCurrentChange = (e) => {
    const checked = e.target.checked;
    setCurrent(checked);
    setEntry((prev) => ({ ...prev, endDate: checked ? 'Present' : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = [...workExperience];
      
      if (index !== null) {
        updated[index] = entry;
      } else {
        updated.push(entry);
      }

      if (user?.uid) {
        await saveData('workExperience', updated);
      } else {
        localStorage.setItem('workExperience', JSON.stringify(updated));
      }
      
      setWorkExperience(updated);
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="e.g. Software Engineer"
          value={entry.title}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
          disabled={isSaving}
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
          placeholder="e.g. Google"
          value={entry.company}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
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
          placeholder="e.g. Mountain View, CA"
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
          value={current ? '' : entry.endDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          disabled={isSaving || current}
        />
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={current}
            onChange={handleCurrentChange}
            disabled={isSaving}
            className="mr-2"
          />
          Current
        </label>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={entry.description}
          onChange={handleChange}
          placeholder="Describe your responsibilities and achievements..."
          className="border p-2 rounded w-full h-32"
          disabled={isSaving}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        disabled={isSaving}
      >
        {isSaving ? <Spinner size="sm" color="white" /> : null}
        {index !== null ? 'Update Experience' : 'Add Experience'}
      </button>
    </form>
  );
}
  