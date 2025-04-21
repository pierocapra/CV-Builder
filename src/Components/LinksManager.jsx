import React, { useState, useEffect } from 'react';

const LinksManager = ({ onClose, existingEntry = null, index = null }) => {
  const [entry, setEntry] = useState({ label: '', url: '' });

  useEffect(() => {
    if (existingEntry) setEntry(existingEntry);
  }, [existingEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem('links')) || [];

    if (index !== null) {
      stored[index] = entry;
    } else {
      stored.push(entry);
    }

    localStorage.setItem('links', JSON.stringify(stored));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700">
          Label (e.g., Portfolio, GitHub)
        </label>
        <input
          type="text"
          name="label"
          id="label"
          placeholder="e.g., Portfolio"
          value={entry.label}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL
        </label>
        <input
          type="url"
          name="url"
          id="url"
          placeholder="https://example.com"
          value={entry.url}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {index !== null ? 'Update Link' : 'Add Link'}
      </button>
    </form>
  );
};

export default LinksManager;
