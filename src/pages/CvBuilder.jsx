import React, { useState, useEffect } from 'react';

function CvBuilder() {
  const [cvData, setCvData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const personal = JSON.parse(localStorage.getItem('cvData')) || {};
    const education = JSON.parse(localStorage.getItem('education')) || [];
    const work = JSON.parse(localStorage.getItem('workExperience')) || [];
    const skills = JSON.parse(localStorage.getItem('skills')) || [];
    const links = JSON.parse(localStorage.getItem('links')) || [];
    setCvData({ personal, education, work, skills, links });
  }, []);

  const toggleItem = (type, item) => {
    const key = JSON.stringify({ type, item });
    setSelectedItems(prev =>
      prev.some(i => JSON.stringify(i) === key)
        ? prev.filter(i => JSON.stringify(i) !== key)
        : [...prev, { type, item }]
    );
  };

  return (
    <div className="flex min-h-screen gap-6">
      {/* Sidebar */}
      <aside className="w-1/3 p-4 bg-white border-r space-y-4 text-sm overflow-y-auto">
        <h2 className="font-semibold">CV Elements</h2>

        <div>
          <label className="block font-medium">Personal Info</label>
          {Object.keys(cvData.personal || {}).map((key) => (
            <div key={key}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => toggleItem('personal', { key, value: cvData.personal[key] })}
                  checked={selectedItems.some(i => i.type === 'personal' && i.item.key === key)}
                />
                <span className="ml-2">{key}: {cvData.personal[key]}</span>
              </label>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium">Education</label>
          {(cvData.education || []).map((edu, i) => (
            <div key={i}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => toggleItem('education', edu)}
                  checked={selectedItems.some(i => i.type === 'education' && i.item === edu)}
                />
                <span className="ml-2">{edu.degree} - {edu.school}</span>
              </label>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium">Work Experience</label>
          {(cvData.work || []).map((job, i) => (
            <div key={i}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => toggleItem('work', job)}
                  checked={selectedItems.some(i => i.type === 'work' && i.item === job)}
                />
                <span className="ml-2">{job.title} at {job.company}</span>
              </label>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium">Skills</label>
          {(cvData.skills || []).map((skill, i) => (
            <div key={i}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => toggleItem('skills', skill)}
                  checked={selectedItems.some(i => i.type === 'skills' && i.item === skill)}
                />
                <span className="ml-2">{skill.name} ({skill.level})</span>
              </label>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium">Links</label>
          {(cvData.links || []).map((link, i) => (
            <div key={i}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => toggleItem('links', link)}
                  checked={selectedItems.some(i => i.type === 'links' && i.item === link)}
                />
                <span className="ml-2">{link.label}: {link.url}</span>
              </label>
            </div>
          ))}
        </div>
      </aside>

      {/* Preview Area */}
      <section className="flex-1 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-4">CV Preview</h2>
        {selectedItems.map((entry, idx) => (
          <div key={idx} className="mb-4 border-b pb-2">
            {entry.type === 'personal' && (
              <p><strong>{entry.item.key}:</strong> {entry.item.value}</p>
            )}
            {entry.type === 'education' && (
              <div>
                <h3 className="font-semibold">{entry.item.degree} in {entry.item.field}</h3>
                <p>{entry.item.school}, {entry.item.location}</p>
                <p>{entry.item.startDate} – {entry.item.endDate}</p>
              </div>
            )}
            {entry.type === 'work' && (
              <div>
                <h3 className="font-semibold">{entry.item.title}</h3>
                <p>{entry.item.company}, {entry.item.location}</p>
                <p>{entry.item.startDate} – {entry.item.endDate}</p>
                <p>{entry.item.description}</p>
              </div>
            )}
            {entry.type === 'skills' && (
              <p>{entry.item.name} ({entry.item.level})</p>
            )}
            {entry.type === 'links' && (
              <p><a href={entry.item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{entry.item.label}</a></p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default CvBuilder;
