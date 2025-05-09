import React from 'react';
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

const ModernTemplate = ({ cvData, groupedItems, handleDragEnd, sensors }) => {
  return (
    <div className="bg-white p-8 text-gray-800">
      {/* Header */}
      {cvData.personal && (
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {cvData.personal.firstName} {cvData.personal.lastName}
          </h1>
          <div className="mt-2 space-y-1">
            {Object.entries(cvData.personal)
              .filter(([key]) => key !== 'firstName' && key !== 'lastName')
              .map(([key, value]) => (
                <p key={key} className="text-sm">
                  <strong className="capitalize">{key}:</strong> {value}
                </p>
              ))}
          </div>
        </div>
      )}

      {/* CV Sections */}
      {['education', 'work', 'skills', 'additional', 'links'].map((sectionKey) =>
        groupedItems[sectionKey]?.length ? (
          <div key={sectionKey} className="mb-8">
            <h2 className="text-xl font-semibold text-sky-700 mb-3 capitalize">{sectionKey}</h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, sectionKey)}
            >
              <SortableContext
                items={groupedItems[sectionKey].map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {groupedItems[sectionKey].map((entry) => (
                  <SortableItem key={entry.id} id={entry.id}>
                    <div className="border p-4 rounded-md mb-3 hover:shadow-sm transition">
                      {entry.type === 'education' && (
                        <>
                          <h3 className="font-medium">{entry.item.degree} in {entry.item.field}</h3>
                          <p className="text-sm">{entry.item.school}, {entry.item.location}</p>
                          <p className="text-xs text-gray-500">{entry.item.startDate} – {entry.item.endDate}</p>
                        </>
                      )}
                      {entry.type === 'work' && (
                        <>
                          <h3 className="font-medium">{entry.item.title}</h3>
                          <p className="text-sm">{entry.item.company}, {entry.item.location}</p>
                          <p className="text-xs text-gray-500">{entry.item.startDate} – {entry.item.endDate}</p>
                          <p className="mt-1 text-sm">{entry.item.description}</p>
                        </>
                      )}
                      {entry.type === 'skills' && (
                        <p className="text-sm">{entry.item.name} ({entry.item.level})</p>
                      )}
                      {entry.type === 'additional' && (
                        <p className="text-sm"><strong>{entry.item.key}:</strong> {entry.item.value}</p>
                      )}
                      {entry.type === 'links' && (
                        <a
                          href={entry.item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {entry.item.label}
                        </a>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null
      )}
    </div>
  );
};

export default ModernTemplate;
