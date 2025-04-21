import React, { useState, useEffect } from 'react';

export default function SkillsManager({ onClose, index = null }) {
  const [skills, setSkills] = useState([]);
  const [skillEntry, setSkillEntry] = useState({
    name: '',
    level: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('skills');
    if (stored) {
      setSkills(JSON.parse(stored));
    }
    if (index !== null) {
      const current = JSON.parse(localStorage.getItem('skills'))[index];
      setSkillEntry(current);
    }
  }, [index]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkillEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updated = [...skills];
    if (index !== null) {
      updated[index] = skillEntry;
    } else {
      updated.push(skillEntry);
    }
    localStorage.setItem('skills', JSON.stringify(updated));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Skill
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="e.g. React.js"
          value={skillEntry.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">
          Proficiency Level
        </label>
        <input
          type="text"
          id="level"
          name="level"
          placeholder="e.g. Intermediate, Expert"
          value={skillEntry.level}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
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
