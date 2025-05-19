import React, { useState, useEffect } from 'react';
import { useAuth } from '../Utils/AuthContext';
import { useCv } from '../Utils/cvHooks';
import Spinner from './Spinner';

const LinksManager = ({ onClose, existingEntry = null, index = null }) => {
  const { user, saveData } = useAuth();
  const { links, setLinks } = useCv();
  const [isSaving, setIsSaving] = useState(false);

  const [entry, setEntry] = useState({ label: '', url: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingEntry) setEntry(existingEntry);
  }, [existingEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = [...links];
      
      if (index !== null) {
        updated[index] = entry;
      } else {
        updated.push(entry);
      }

      if (user?.uid) {
        await saveData('links', updated);
      } else {
        localStorage.setItem('links', JSON.stringify(updated));
      }
      
      setLinks(updated);
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
          disabled={isSaving}
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
          disabled={isSaving}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        disabled={isSaving}
      >
        {isSaving ? <Spinner size="sm" color="white" /> : null}
        {index !== null ? 'Update Link' : 'Add Link'}
      </button>
    </form>
  );
};

export default LinksManager;
