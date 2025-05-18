import {
    DndContext,
    closestCenter,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    verticalListSortingStrategy
  } from '@dnd-kit/sortable';
  ;
import { SortableItem } from "../Utils/DndUtils.jsx";
import { SortableSection } from "../Utils/DndUtils.jsx";
import { formatCvValue, formatFieldName } from "../Utils/formatters";

const ModernTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
  const textClasses = {
    gray: 'text-gray-500',
    sky: 'text-sky-700',
    teal: 'text-teal-700',
    red: 'text-red-400',
    cyan: 'text-cyan-700',
  };
  
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
        >
        <SortableContext
            items={sectionOrder}
            strategy={verticalListSortingStrategy}
        >

            {sectionOrder.map((sectionKey) =>
        groupedItems[sectionKey]?.length ? (
            <SortableSection key={sectionKey} id={sectionKey}>
          <div className="mb-6 border border-transparent hover:border-dashed hover:border-gray-400 rounded  hover:cursor-move">
            {sectionKey !== 'additional' ? (
              <h2 className={`text-xl font-semibold ${textClasses[color]} mb-3 capitalize`}>{sectionKey}</h2>
            ) : (
              <h2 className={`text-xl font-semibold ${textClasses[color]} mb-3`}>Additional Info</h2>
            )}
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
                    <div className="relative pb-4 mb-1 mt-1 hover:bg-gray-50 transition">

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
                      {entry.type === 'summary' && (
                        <p className="text-base leading-relaxed text-gray-700 italic">{entry.item.value}</p>
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
                      {entry.type === 'additional' && (
                        <p className="text-sm">
                          <strong>{formatFieldName(entry.item.key)}:</strong> {formatCvValue(entry.item.key, entry.item.value)}
                        </p>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </SortableSection>) : null)}
    </SortableContext>
        </DndContext>
                </div>
  );
};

export default ModernTemplate;
