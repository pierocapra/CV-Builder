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
import CustomDropdown from '../Components/CustomDropdown';
import { formatFieldName, formatCvValue } from '../Utils/formatters';

// Template options
const templateOptions = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'modern', label: 'Modern' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'compact', label: 'Compact' },
  { value: 'creative', label: 'Creative' },
  { value: 'bold', label: 'Bold' },
];

// Color options
const colorOptions = [
  { value: 'gray', label: 'Gray' },
  { value: 'sky', label: 'Sky' },
  { value: 'teal', label: 'Teal' },
  { value: 'red', label: 'Red' },
  { value: 'cyan', label: 'Cyan' },
];

function CvAssemble({ cvData: initialCvData }) {
  const { user } = useAuth();
  const cvData = initialCvData || {};
  const [selectedItems, setSelectedItems] = useState([]);
  const [template, setTemplate] = useState('minimal');
  const [color, setColor] = useState('gray');
  const [sectionOrder, setSectionOrder] = useState([
    'education', 'work', 'skills', 'links', 'additional'
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex flex-col md:flex-row min-h-screen gap-4">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 right-4 z-50 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        {isSidebarOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full w-full md:w-80
        bg-gray-200 border-r text-sm
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-40 md:z-auto p-4 pt-8 overflow-y-auto md:min-h-screen
      `}>
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
        <CustomDropdown
          label="Template"
          value={template}
          onChange={(value) => setTemplate(value)}
          options={templateOptions}
        />

        {/* Color Selection */}
        <CustomDropdown
          label="Color Theme"
          value={color}
          onChange={(value) => setColor(value)}
          options={colorOptions}
        />

        {/* Additional Info */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Additional Info</label>
          {Object.keys(cvData.additional || {}).map((key) => (
            <div key={key} className="ml-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => toggleItem('additional', { key, value: cvData.additional[key] })}
                  checked={selectedItems.some(i => i.type === 'additional' && i.item.key === key)}
                  className="form-checkbox"
                />
                <span className="text-sm">
                  {formatFieldName(key)}: {formatCvValue(key, cvData.additional[key])}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Education</label>
          {(cvData.education || []).map((edu, i) => (
            <div key={i} className="ml-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => toggleItem('education', edu)}
                  checked={selectedItems.some(i => i.type === 'education' && i.item === edu)}
                  className="form-checkbox"
                />
                <span className="text-sm">{edu.degree} - {edu.school}</span>
              </label>
            </div>
          ))}
        </div>

        {/* Work Experience */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Work Experience</label>
          {(cvData.work || []).map((job, i) => (
            <div key={i} className="ml-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => toggleItem('work', job)}
                  checked={selectedItems.some(i => i.type === 'work' && i.item === job)}
                  className="form-checkbox"
                />
                <span className="text-sm">{job.title} at {job.company}</span>
              </label>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Skills</label>
          {(cvData.skills || []).map((skill, i) => (
            <div key={i} className="ml-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => toggleItem('skills', skill)}
                  checked={selectedItems.some(i => i.type === 'skills' && i.item === skill)}
                  className="form-checkbox"
                />
                <span className="text-sm">{skill.name} ({skill.level})</span>
              </label>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Links</label>
          {(cvData.links || []).map((link, i) => (
            <div key={i} className="ml-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => toggleItem('links', link)}
                  checked={selectedItems.some(i => i.type === 'links' && i.item === link)}
                  className="form-checkbox"
                />
                <span className="text-sm">{link.label}: {link.url}</span>
              </label>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1  md:min-h-screen overflow-y-auto
        ${isSidebarOpen ? 'hidden md:block' : 'block'}
      `}>
        <div ref={contentRef} className="max-w-4xl mx-auto bg-white shadow-lg p-4 md:p-8 mb-4">
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
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default CvAssemble;
