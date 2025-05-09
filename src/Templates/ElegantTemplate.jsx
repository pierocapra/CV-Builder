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

// Reusable draggable item
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

const ElegantTemplate = ({ cvData, groupedItems, handleDragEnd, sensors }) => {
  return (
    <div className="bg-white p-10 font-serif text-gray-800 leading-relaxed">
      {cvData.personal && (
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            {cvData.personal.firstName} {cvData.personal.lastName}
          </h1>
          <div className="mt-2 text-sm text-gray-600">
            {Object.entries(cvData.personal)
              .filter(([key]) => key !== 'firstName' && key !== 'lastName')
              .map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
          </div>
        </header>
      )}

      {['additional', 'education', 'work', 'skills', 'links'].map((sectionKey) =>
        groupedItems[sectionKey]?.length ? (
          <section key={sectionKey} className="mb-10">
            <h2 className="text-2xl border-b pb-1 mb-4 text-indigo-700 font-semibold capitalize">
              {sectionKey}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, sectionKey)}
            >
              <SortableContext
                items={groupedItems[sectionKey].map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {groupedItems[sectionKey].map((entry) => (
                    <SortableItem key={entry.id} id={entry.id}>
                      <div className="border-l-4 border-indigo-500 pl-4 py-2 hover:bg-indigo-50 rounded">
                        {entry.type === 'additional' && (
                          <p><strong>{entry.item.key}:</strong> {entry.item.value}</p>
                        )}
                        {entry.type === 'education' && (
                          <div>
                            <h3 className="font-semibold text-lg">{entry.item.degree} in {entry.item.field}</h3>
                            <p className="italic">{entry.item.school}, {entry.item.location}</p>
                            <p className="text-sm">{entry.item.startDate} – {entry.item.endDate}</p>
                          </div>
                        )}
                        {entry.type === 'work' && (
                          <div>
                            <h3 className="font-semibold text-lg">{entry.item.title}</h3>
                            <p className="italic">{entry.item.company}, {entry.item.location}</p>
                            <p className="text-sm">{entry.item.startDate} – {entry.item.endDate}</p>
                            <p>{entry.item.description}</p>
                          </div>
                        )}
                        {entry.type === 'skills' && (
                          <p><strong>{entry.item.name}</strong> – {entry.item.level}</p>
                        )}
                        {entry.type === 'links' && (
                          <p>
                            <a
                              href={entry.item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-700 underline"
                            >
                              {entry.item.label}
                            </a>
                          </p>
                        )}
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </section>
        ) : null
      )}
    </div>
  );
};

export default ElegantTemplate;
