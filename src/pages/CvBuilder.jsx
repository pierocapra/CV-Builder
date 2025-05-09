import React, { useState, useEffect, useRef } from 'react';
import {
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
  } from '@dnd-kit/core';
  import {
    arrayMove,
    sortableKeyboardCoordinates,
  } from '@dnd-kit/sortable';

  import { useReactToPrint } from 'react-to-print';
  import DefaultTemplate from "../Templates/DefaultTemplate";
  import ModernTemplate from "../Templates/ModernTemplate";
  import ElegantTemplate from "../Templates/ElegantTemplate";
  

function CvBuilder() {
  const [cvData, setCvData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [template, setTemplate] = useState('default'); 
  const [color,setColor] = useState('sky'); 
  const [sectionOrder, setSectionOrder] = useState([
     'education', 'work', 'skills', 'links','additional'
  ]);

  // Setup sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  
  const handleDragEnd = (event, sectionKey) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    setSelectedItems(prev => {
      const filtered = prev.filter(item => item.type === sectionKey);
      const rest = prev.filter(item => item.type !== sectionKey);
  
      const oldIndex = filtered.findIndex(item => item.id === active.id);
      const newIndex = filtered.findIndex(item => item.id === over.id);
      const reordered = arrayMove(filtered, oldIndex, newIndex);
  
      return [...rest, ...reordered];
    });
  };

  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = sectionOrder.findIndex((id) => id === active.id);
    const newIndex = sectionOrder.findIndex((id) => id === over.id);
  
    setSectionOrder((items) => arrayMove(items, oldIndex, newIndex));
  };
  

  useEffect(() => {
    const personal = JSON.parse(localStorage.getItem('personalInfo')) || {};
    const additional = JSON.parse(localStorage.getItem('additionalInfo')) || {};
    const education = JSON.parse(localStorage.getItem('education')) || [];
    const work = JSON.parse(localStorage.getItem('workExperience')) || [];
    const skills = JSON.parse(localStorage.getItem('skills')) || [];
    const links = JSON.parse(localStorage.getItem('links')) || [];
    setCvData({ personal, additional, education, work, skills, links });
  }, []);

  const toggleItem = (type, item) => {
    const id = `${type}-${JSON.stringify(item)}`;
    const newItem = { type, item, id };
    setSelectedItems(prev =>
      prev.some(i => i.id === id)
        ? prev.filter(i => i.id !== id)
        : [...prev, newItem]
    );
  };

  const groupedItems = selectedItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const contentRef = useRef();
  const handlePrint = useReactToPrint({ contentRef }); 
  

  return (
    <div className="flex min-h-screen gap-6">
      {/* Sidebar */}
      <aside className="w-1/4 p-4 bg-gray-200 border-r space-y-4 text-sm overflow-y-auto">
        <h2 className="font-semibold">CV Elements</h2>

        <div>
          <label className="block font-medium">Additional Info</label>
          {Object.keys(cvData.additional || {}).map((key) => (
            <div key={key}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => toggleItem('additional', { key, value: cvData.additional[key] })}
                  checked={selectedItems.some(i => i.type === 'additional' && i.item.key === key)}
                />
                <span className="ml-2">{key}: {cvData.additional[key]}</span>
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
      <section ref={contentRef} className="flex-1">
        {template === 'default' && (
          <DefaultTemplate
            cvData={cvData}
            groupedItems={groupedItems}
            sensors={sensors}
            handleDragEnd={handleDragEnd}
            handleSectionDragEnd={handleSectionDragEnd}
            sectionOrder={sectionOrder}
            color={color}
          />
        )}
        {template === 'modern' && (
          <ModernTemplate
            cvData={cvData}
            groupedItems={groupedItems}
            sensors={sensors}
            handleDragEnd={handleDragEnd}
            handleSectionDragEnd={handleSectionDragEnd}
            sectionOrder={sectionOrder}
            color={color}
          />
        )}
        {template === 'elegant' && (
          <ElegantTemplate  
            cvData={cvData}
            groupedItems={groupedItems}
            sensors={sensors}
            handleDragEnd={handleDragEnd}
            handleSectionDragEnd={handleSectionDragEnd}
            sectionOrder={sectionOrder}
            color={color}
          />      
        )}
      </section>
      {/* Options Area */}
      <div className="flex flex-col gap-2 mb-4 mt-4">
        <h4 className="font-bold underline underline-offset-6">TEMPLATES</h4>
        <button onClick={() => setTemplate('default')} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Default</button>
        <button onClick={() => setTemplate('modern')} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Modern</button>
        <button onClick={() => setTemplate('elegant')} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Elegant</button>
        <h4 className="font-bold underline underline-offset-6">COLORS</h4>
        <button onClick={() => setColor('sky')} className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">Sky</button>
        <button onClick={() => setColor('teal')} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Teal</button>
        <button onClick={() => setColor('orange')} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Orange</button>
        <button onClick={() => setColor('cyan')} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">Cyan</button>
        <h4 className="font-bold underline underline-offset-6">FORMAT</h4>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          PDF
        </button>
      </div>
    </div>
  );
}

export default CvBuilder;
