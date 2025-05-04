import React, { useState, useEffect, useRef } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
  } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';

  import { useReactToPrint } from 'react-to-print';

  

  function SortableItem({ id, children }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: 'grab',
    };
  
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }
  

function CvBuilder() {
  const [cvData, setCvData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

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

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  return (
    <div className="flex min-h-screen gap-6">
      {/* Sidebar */}
      <aside className="w-1/3 p-4 bg-gray-200 border-r space-y-4 text-sm overflow-y-auto">
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
      <section ref={contentRef} className="flex-1 bg-white p-6 rounded-lg shadow-inner">
          {cvData.personal && (
            <>
              <h2 className="text-2xl font-bold mb-4">
                {cvData.personal.firstName} {cvData.personal.lastName}
              </h2>
              {Object.entries(cvData.personal)
                .filter(([key]) => key !== 'firstName' && key !== 'lastName')
                .map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
            </>
          )}

          {['additional', 'education', 'work', 'skills', 'links'].map((sectionKey) =>
            groupedItems[sectionKey]?.length ? (
              <div key={sectionKey} className="mt-6">
                <h3 className="text-xl text-sky-600 font-medium mb-4 capitalize">{sectionKey}</h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(event, sectionKey)} // adjust per section
                >
                  <SortableContext
                    items={groupedItems[sectionKey].map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {groupedItems[sectionKey].map((entry) => (
                      <SortableItem key={entry.id} id={entry.id}>
                        <div className="hover:shadow hover:bg-gray-100 rounded p-2">
                          {entry.type === 'additional' && (
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
                            <p>
                              <a href={entry.item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {entry.item.label}
                              </a>
                            </p>
                          )}
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            ) : null
          )}
        </section>
        <div>
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Print / Save PDF
                </button>
        </div>

       

    </div>
  );
}

export default CvBuilder;
