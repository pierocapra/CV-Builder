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

import { getPageMargins } from '../styles/PdfUtils';

const ModernTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
  const textClasses = {
    gray: 'text-gray-500',
    sky: 'text-sky-700',
    teal: 'text-teal-700',
    red: 'text-red-400',
    cyan: 'text-cyan-700',
  };
  
  const renderSkills = (skills) => (
    <div className="flex flex-wrap gap-2 items-center">
      {skills.map((entry, index) => (
        <span key={entry.id} className="text-sm text-gray-700">
          {entry.item.name} · {entry.item.level}
          {index < skills.length - 1 && <span className="mx-2 text-gray-400">|</span>}
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-white px-6 text-gray-800">
      
      <style>{getPageMargins()}</style>
      {/* Header */}
      {cvData.personal && (
        <div className="mb-4 border-b pb-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {cvData.personal.firstName} {cvData.personal.lastName}
          </h1>
          <p className="text-base text-gray-600 mt-1">{cvData.personal.title}</p>
          <div className="mt-2 space-y-0.5">
            {Object.entries(cvData.personal)
              .filter(([key]) => !['firstName', 'lastName', 'title'].includes(key))
              .map(([key, value]) => (
                <p key={key} className="text-sm">
                  <strong className="capitalize">{key}:</strong>{' '}
                  {formatCvValue(key, value)}
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
                  <div className="mb-4 border border-transparent hover:border-dashed hover:border-gray-400 rounded hover:cursor-move">
                    {sectionKey !== 'additional' ? (
                      <h2 className={`text-lg font-semibold ${textClasses[color]} mb-2 capitalize`}>
                        {sectionKey === 'summary' ? 'Professional Summary' : sectionKey}
                      </h2>
                    ) : (
                      <h2 className={`text-lg font-semibold ${textClasses[color]} mb-2`}>Additional Info</h2>
                    )}

                    {sectionKey === 'skills' ? (
                      renderSkills(groupedItems[sectionKey])
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleDragEnd(event, sectionKey)}
                      >
                        <SortableContext
                          items={groupedItems[sectionKey].map(item => item.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {groupedItems[sectionKey].map((entry) => (
                            <SortableItem key={entry.id} id={entry.id}>
                              <div className="relative pb-3 mb-1 hover:bg-gray-50 transition">
                                {entry.type === 'education' && (
                                  <>
                                    <h3 className="font-medium text-base">{entry.item.degree} in {entry.item.field}</h3>
                                    <p className="text-sm">{entry.item.school}, {entry.item.location}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(entry.item.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })} – {
                                        entry.item.endDate === 'Present' ? 'Present' :
                                        new Date(entry.item.endDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                                      }
                                    </p>
                                  </>
                                )}
                                {entry.type === 'work' && (
                                  <>
                                    <h3 className="font-medium text-base">{entry.item.title}</h3>
                                    <p className="text-sm">{entry.item.company}, {entry.item.location}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(entry.item.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })} – {
                                        entry.item.endDate === 'Present' ? 'Present' :
                                        new Date(entry.item.endDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                                      }
                                    </p>
                                    <p className="mt-1 text-sm">{entry.item.description}</p>
                                  </>
                                )}
                                {entry.type === 'links' && (
                                  <p className="text-sm">
                                    <strong>{entry.item.label}:</strong> {entry.item.url}
                                  </p>
                                )}
                                {entry.type === 'additional' && (
                                  <p className="text-sm">
                                    <strong>{formatFieldName(entry.item.key)}:</strong> {formatCvValue(entry.item.key, entry.item.value)}
                                  </p>
                                )}
                                {entry.type === 'summary' && (
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {entry.item.value}
                                  </p>
                                )}
                              </div>
                            </SortableItem>
                          ))}
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </SortableSection>
              ) : null
            )}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ModernTemplate;
