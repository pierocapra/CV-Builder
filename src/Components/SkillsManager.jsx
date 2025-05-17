import React, { useState, useEffect } from 'react';
import { useAuth } from '../Utils/AuthContext';
import { useCv } from '../Utils/cvHooks';

export default function SkillsManager({ onClose, existingEntry = null, index = null }) {
  const { user, saveData } = useAuth();
  const { skills, setSkills } = useCv();

  const [entry, setEntry] = useState(
    existingEntry || {
      name: '',
      level: '',
    }
  );

  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingEntry) {
      setEntry(existingEntry);
    }
  }, [existingEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = [...skills];
      
      if (index !== null) {
        updated[index] = entry;
      } else {
        updated.push(entry);
      }

      if (user?.uid) {
        await saveData('skills', updated);
      } else {
        localStorage.setItem('skills', JSON.stringify(updated));
      }
      
      setSkills(updated);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Skill Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="e.g. JavaScript"
          value={entry.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">
          Proficiency Level
        </label>
        <select
          name="level"
          id="level"
          value={entry.level}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {index !== null ? 'Update Skill' : 'Add Skill'}
      </button>
    </form>
  );
}
