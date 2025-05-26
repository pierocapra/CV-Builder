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

const ElegantTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd,  sectionOrder, color}) => {
  const textClasses = {
    gray: 'text-gray-500',
    sky: 'text-sky-600',
    teal: 'text-teal-600',
    red: 'text-red-400',
    cyan: 'text-cyan-600',
  };
  const borderClasses = {
    gray: 'border-gray-400',
    sky: 'border-sky-600',
    teal: 'border-teal-600',
    red: 'border-red-400',
    cyan: 'border-cyan-600',
  }

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
    <div className="bg-white px-8 font-serif text-gray-800 leading-relaxed">

      <style>{getPageMargins()}</style>
      {/* Header */}
      {cvData.personal && (
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            {cvData.personal.firstName} {cvData.personal.lastName}
          </h1>
          <div className="mt-2 text-sm text-gray-600">
            {Object.entries(cvData.personal)
              .filter(([key]) => key !== 'firstName' && key !== 'lastName')
              .map(([key, value]) => (
                <p key={key} className="text-sm">
                  <strong>{key}:</strong>{' '}
                  {formatCvValue(key, value)}
                </p>
              ))}
          </div>
        </header>
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
                <div className="mb-8 border border-transparent hover:border-dashed hover:border-gray-400 rounded hover:cursor-move">
                  <h2 className={`text-xl font-serif ${textClasses[color]} mb-3 capitalize`}>
                    {sectionKey === 'summary' ? 'Professional Summary' : 
                     sectionKey === 'additional' ? 'Additional Info' : 
                     sectionKey}
                  </h2>
                  
                  {sectionKey === 'skills' ? (
                    renderSkills(groupedItems[sectionKey])
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleDragEnd(event, sectionKey)}
                    >
                      <SortableContext
                        items={groupedItems[sectionKey].map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {groupedItems[sectionKey].map((entry) => (
                            <SortableItem key={entry.id} id={entry.id}>
                              <div className={`border-l-3 ${borderClasses[color]} pl-3 py-2 hover:bg-indigo-50 rounded`}>
                                {entry.type === 'summary' && (
                                  <p className="text-base leading-relaxed text-gray-700 font-light italic">{entry.item.value}</p>
                                )}
                                {entry.type === 'additional' && (
                                  <p className="text-sm">
                                    <strong>{formatFieldName(entry.item.key)}:</strong> {formatCvValue(entry.item.key, entry.item.value)}
                                  </p>
                                )}
                                {entry.type === 'education' && (
                                  <div>
                                    <h3 className="font-semibold text-base">{entry.item.degree} in {entry.item.field}</h3>
                                    <p className="italic text-sm">{entry.item.school}, {entry.item.location}</p>
                                    <p className="text-xs text-gray-600">
                                      {new Date(entry.item.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })} – {
                                        entry.item.endDate === 'Present' ? 'Present' :
                                        new Date(entry.item.endDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                                      }
                                    </p>
                                  </div>
                                )}
                                {entry.type === 'work' && (
                                  <div>
                                    <h3 className="font-semibold text-base">{entry.item.title}</h3>
                                    <p className="italic text-sm">{entry.item.company}, {entry.item.location}</p>
                                    <p className="text-xs text-gray-600">
                                      {new Date(entry.item.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })} – {
                                        entry.item.endDate === 'Present' ? 'Present' :
                                        new Date(entry.item.endDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                                      }
                                    </p>
                                    <p className="text-sm mt-1">{entry.item.description}</p>
                                  </div>
                                )}
                                {entry.type === 'links' && (
                                  <p className="text-sm">
                                    <strong>{entry.item.label}:</strong> {entry.item.url}
                                  </p>
                                )}
                              </div>
                            </SortableItem>
                          ))}
                        </div>
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

export default ElegantTemplate;
