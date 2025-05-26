import {
    DndContext,
    closestCenter,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    verticalListSortingStrategy
  } from '@dnd-kit/sortable';
  
  import { SortableItem, SortableSection } from "../Utils/DndUtils.jsx";
  import { formatCvValue, formatFieldName } from "../Utils/formatters";

  import { getPageMargins } from '../styles/PdfUtils';
  
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
  
  const MinimalTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
    const textClasses = {
      gray: 'text-gray-500',
      sky: 'text-sky-700',
      teal: 'text-teal-700',
      red: 'text-red-500',
      cyan: 'text-cyan-700',
    };
  
    return (
      <div className="bg-white px-8 pt-8 font-sans text-gray-900">
        <style>{getPageMargins()}</style>
        {/* Header */}
        {cvData.personal && (
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              {cvData.personal.firstName} {cvData.personal.lastName}
            </h1>
            <div className="text-sm text-gray-600 mt-1">
              {Object.entries(cvData.personal)
                .filter(([key]) => key !== 'firstName' && key !== 'lastName')
                .map(([key, value]) => (
                  <p key={key}><strong className="capitalize">{key}:</strong> {value}</p>
                ))}
            </div>
          </header>
        )}
  
        {/* Sections */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((sectionKey) =>
              groupedItems[sectionKey]?.length ? (
                <SortableSection key={sectionKey} id={sectionKey}>
                  <div className="mb-6 group border border-transparent hover:border-dashed hover:border-gray-400 rounded hover:cursor-move rounded p-2 transition print:mt-8">
                    {sectionKey !== 'additional' ? (
                      <h2 className={`text-xl ${textClasses[color]} font-semibold mb-2 capitalize`}>
                        {sectionKey === 'summary' ? 'Professional Summary' : sectionKey}
                      </h2>
                    ) : (
                      <h2 className={`text-xl ${textClasses[color]} font-semibold mb-2`}>Additional Info</h2>
                    )}
                    {sectionKey === 'skills' ? (
                      renderSkills(groupedItems[sectionKey])
                    ) : (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, sectionKey)}>
                        <SortableContext items={groupedItems[sectionKey].map(item => item.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2">
                            {groupedItems[sectionKey].map((entry) => (
                              <SortableItem key={entry.id} id={entry.id}>
                                <div className="px-3 py-2 bg-white border-l-2 border-gray-300 hover:shadow-sm hover:bg-gray-50 transition">
                                  {entry.type === 'education' && (
                                    <div>
                                      <p className="font-semibold">{entry.item.degree} in {entry.item.field}</p>
                                      <p className="text-sm text-gray-600">{entry.item.school}, {entry.item.location}</p>
                                    </div>
                                  )}
                                  {entry.type === 'work' && (
                                    <div>
                                      <p className="font-semibold">{entry.item.title}</p>
                                      <p className="text-sm text-gray-600">{entry.item.company}</p>
                                      <p className="text-sm">{entry.item.description}</p>
                                    </div>
                                  )}
                                  {entry.type === 'skills' && (
                                    <p className="text-sm text-gray-700">{entry.item.name} • {entry.item.level}</p>
                                  )}
                                  {entry.type === 'links' && (
                                    <p className="text-sm">
                                      <strong>{entry.item.label}:</strong> {entry.item.url}
                                    </p>
                                  )}
                                  {entry.type === 'summary' && (
                                    <p className="text-gray-700 leading-relaxed italic">{entry.item.value}</p>
                                  )}
                                  {entry.type === 'additional' && (
                                    <p>
                                      <strong>{formatFieldName(entry.item.key)}:</strong> {formatCvValue(entry.item.key, entry.item.value)}
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
  
  export default MinimalTemplate;
  