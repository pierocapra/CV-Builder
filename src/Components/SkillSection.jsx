import React, { useState, useEffect } from 'react';
import SkillManager from './SkillsManager';
import Modal from './Modal';

export default function SkillSection() {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('skills');
    if (stored) {
      setSkills(JSON.parse(stored));
    }
  }, [showModal]);

  const handleDelete = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    localStorage.setItem('skills', JSON.stringify(updated));
    setSkills(updated);
  };

  const openEditor = (index = null) => {
    setEditIndex(index);
    setShowModal(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <button
          onClick={() => openEditor()}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        <ul className="space-y-2">
          {skills.map((skill, i) => (
            <li key={i} className="border p-3 rounded flex justify-between items-center">
              <div>
                <strong>{skill.name}</strong> – <span>{skill.level}</span>
              </div>
              <div className="space-x-2">
                <button onClick={() => openEditor(i)} className="text-blue-600 underline">Edit</button>
                <button onClick={() => handleDelete(i)} className="text-red-600 underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SkillManager index={editIndex} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}
