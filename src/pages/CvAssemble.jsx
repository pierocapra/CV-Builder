import React, { useState, useRef } from 'react';
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
import ModernTemplate from "../Templates/ModernTemplate";
import ElegantTemplate from "../Templates/ElegantTemplate";
import MinimalTemplate from "../Templates/MinimalTemplate";
import CompactTemplate from "../Templates/CompactTemplate";
import CreativeTemplate from "../Templates/CreativeTemplate";
import BoldTemplate from "../Templates/BoldTemplate";
import { useAuth } from '../Utils/AuthContext';

function CvAssemble({ cvData: initialCvData }) {
  const { user } = useAuth();
  const [cvData, setCvData] = useState(() => initialCvData || {});
  const [selectedItems, setSelectedItems] = useState([]);
  const [template, setTemplate] = useState('minimal');
  const [color, setColor] = useState('gray');
  const [sectionOrder, setSectionOrder] = useState([
    'education', 'work', 'skills', 'links', 'additional'
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">CV Elements</h2>
          <button
            onClick={handlePrint}
            disabled={!user}
            className={`px-3 py-1 rounded text-white ${
              user 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            title={!user ? 'Login to enable PDF download' : 'Download PDF'}
          >
            PDF
          </button>
        </div>

        {/* Template Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="minimal">Minimal</option>
            <option value="modern">Modern</option>
            <option value="elegant">Elegant</option>
            <option value="compact">Compact</option>
            <option value="creative">Creative</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Color Theme</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="gray">Gray</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
            <option value="purple">Purple</option>
          </select>
        </div>

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
        {template === 'minimal' && (
          <MinimalTemplate  
            cvData={cvData}
            groupedItems={groupedItems}
            sensors={sensors}
            handleDragEnd={handleDragEnd}
            handleSectionDragEnd={handleSectionDragEnd}
            sectionOrder={sectionOrder}
            color={color}
          />      
        )}
        {template === 'compact' && (
          <CompactTemplate 
            cvData={cvData}
            groupedItems={groupedItems}
            sensors={sensors}
            handleDragEnd={handleDragEnd}
            handleSectionDragEnd={handleSectionDragEnd}
            sectionOrder={sectionOrder}
            color={color} 
          />
        )}
        {template === 'creative' && (
          <CreativeTemplate 
            cvData={cvData}
            groupedItems={groupedItems}
            sensors={sensors}
            handleDragEnd={handleDragEnd}
            handleSectionDragEnd={handleSectionDragEnd}
            sectionOrder={sectionOrder}
            color={color} 
          />
        )}
        {template === 'bold' && (
          <BoldTemplate 
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
    </div>
  );
}

export default CvAssemble;
