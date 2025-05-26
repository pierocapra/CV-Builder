import React, { useState, useRef } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor
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
import { useCv } from '../Utils/cvHooks';

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
  const { 
    selectedItems, 
    saveSelectedItems, 
    savedTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate 
  } = useCv();
  const cvData = initialCvData || {};
  const [template, setTemplate] = useState('minimal');
  const [color, setColor] = useState('gray');
  const [sectionOrder, setSectionOrder] = useState([
    'summary', 'education', 'work', 'skills', 'links', 'additional'
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTemplateSaveModalOpen, setIsTemplateSaveModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [saveError, setSaveError] = useState('');

  // Setup sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the pointer to move by 8 pixels before activating
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event, sectionKey) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const filtered = selectedItems.filter(item => item.type === sectionKey);
    const rest = selectedItems.filter(item => item.type !== sectionKey);

    const oldIndex = filtered.findIndex(item => item.id === active.id);
    const newIndex = filtered.findIndex(item => item.id === over.id);
    const reordered = arrayMove(filtered, oldIndex, newIndex);

    const newSelectedItems = [...rest, ...reordered];
    saveSelectedItems(newSelectedItems);
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
    
    const newSelectedItems = selectedItems.some(i => i.id === id)
      ? selectedItems.filter(i => i.id !== id)
      : [...selectedItems, newItem];
    
    saveSelectedItems(newSelectedItems);
  };

  const groupedItems = selectedItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const contentRef = useRef();
  const handlePrint = useReactToPrint({ contentRef });

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setSaveError('Please enter a template name');
      return;
    }

    try {
      await saveTemplate(
        templateName,
        selectedItems,
        template,
        color
      );
      setTemplateName('');
      setIsTemplateSaveModalOpen(false);
      setSaveError('');
    } catch (error) {
      setSaveError('Failed to save template');
      console.error('Failed to save template:', error);
    }
  };

  const handleLoadTemplate = async (templateId) => {
    const loaded = await loadTemplate(templateId);
    if (loaded) {
      setTemplate(loaded.templateStyle);
      setColor(loaded.colorTheme);
    }
  };

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
          <div className="flex gap-2">
            <button
              onClick={() => setIsTemplateSaveModalOpen(true)}
              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              title="Save current selection as template"
            >
              Save
            </button>
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
        </div>

        {/* Saved Templates Section */}
        {savedTemplates.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Saved Templates</h3>
            <div className="space-y-2">
              {savedTemplates.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-white p-2 rounded">
                  <button
                    onClick={() => handleLoadTemplate(t.id)}
                    className="text-left flex-grow hover:text-blue-600"
                  >
                    {t.name}
                  </button>
                  <button
                    onClick={() => deleteTemplate(t.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Summary */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Summary</label>
          {cvData.additional?.summaries && cvData.additional.summaries.length > 0 && (
            <div className="ml-2 space-y-1">
              {cvData.additional.summaries.map((summary, idx) => {
                const id = `summary-${idx}`;
                const isSelected = selectedItems.some(i => i.type === 'summary' && i.item.idx === idx);
                // Get first 8 words for preview
                const preview = summary.split(/\s+/).slice(0, 8).join(' ');
                const ellipsis = summary.split(/\s+/).length > 8 ? ' ...' : '';
                return (
                  <label key={id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="summary-choice"
                      onChange={() => {
                        // Remove any existing summary from selectedItems, then add this one
                        const filtered = selectedItems.filter(i => i.type !== 'summary');
                        const newItem = { type: 'summary', item: { value: summary, idx }, id: `summary-${idx}` };
                        saveSelectedItems([...filtered, newItem]);
                      }}
                      checked={isSelected}
                      className="form-radio"
                    />
                    <span className="text-sm">Summary {idx + 1} - {preview}{ellipsis}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Additional Info</label>
          {Object.entries(cvData.additional || {})
            .filter(([key]) => key !== 'summary' && key !== 'summaries')
            .map(([key, value]) => (
              <div key={key} className="ml-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => toggleItem('additional', { key, value })}
                    checked={selectedItems.some(i => i.type === 'additional' && i.item.key === key)}
                    className="form-checkbox"
                  />
                  <span className="text-sm">
                    {formatFieldName(key)}: {formatCvValue(key, value)}
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
                  checked={selectedItems.some(i => i.type === 'education' && i.item.degree === edu.degree && i.item.school === edu.school && i.item.startDate === edu.startDate)}
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
                  checked={selectedItems.some(i => i.type === 'work' && i.item.title === job.title && i.item.company === job.company && i.item.startDate === job.startDate)}
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
                  checked={selectedItems.some(i => i.type === 'skills' && i.item.name === skill.name && i.item.level === skill.level)}
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
                  checked={selectedItems.some(i => i.type === 'links' && i.item.label === link.label && i.item.url === link.url)}
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
        <div ref={contentRef} className="max-w-4xl mx-auto bg-white p-4 md:p-8 mb-4">
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

      {/* Template Save Modal */}
      {isTemplateSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Save Template</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="w-full p-2 border rounded mb-4"
            />
            {saveError && <p className="text-red-600 text-sm mb-4">{saveError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsTemplateSaveModalOpen(false);
                  setTemplateName('');
                  setSaveError('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
