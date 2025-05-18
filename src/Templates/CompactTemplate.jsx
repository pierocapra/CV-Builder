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
  
  const CompactTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
    const headingClasses = {
      gray: 'border-b-2 border-gray-500 text-gray-500',
      sky: 'border-b-2 border-sky-500 text-sky-700',
      teal: 'border-b-2 border-teal-500 text-teal-700',
      red: 'border-b-2 border-red-400 text-red-600',
      cyan: 'border-b-2 border-cyan-500 text-cyan-700',
    };
  
    return (
      <div className="bg-white p-6 font-sans text-gray-900 text-sm">
        {/* Header */}
        {cvData.personal && (
          <header className="mb-6 pb-2">
            <h1 className="text-2xl font-bold">
              {cvData.personal.firstName} {cvData.personal.lastName}
            </h1>
            <div className="text-xs text-gray-600 mt-1">
              {Object.entries(cvData.personal)
                .filter(([key]) => key !== 'firstName' && key !== 'lastName')
                .map(([key, value]) => (
                  <p key={key}>{key}: {value}</p>
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
                  <div className="mb-5 border border-transparent hover:border-dashed hover:border-gray-400 rounded  hover:cursor-move">
                    {sectionKey !== 'additional' ? (
                      <h2 className={`text-base font-semibold uppercase tracking-wide mb-1 ${headingClasses[color]}`}>{sectionKey}</h2>
                    ) : (
                      <h2 className={`text-base font-semibold uppercase tracking-wide mb-1 ${headingClasses[color]}`}>Additional Info</h2>
                    )}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, sectionKey)}>
                      <SortableContext items={groupedItems[sectionKey].map(item => item.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-1">
                          {groupedItems[sectionKey].map((entry) => (
                            <SortableItem key={entry.id} id={entry.id}>
                              {entry.type === 'summary' ? (
                                <li className="pl-0">
                                  <p className="text-sm leading-relaxed text-gray-700 pl-4 border-l-2 border-gray-400">{entry.item.value}</p>
                                </li>
                              ) : (
                                <li className="relative pl-4 rounded">
                                  <span className="absolute left-0 top-2.5 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></span>
                                  {entry.type === 'education' && (
                                    <div>
                                      <p className="font-semibold">{entry.item.degree}</p>
                                      <p className="text-xs">{entry.item.school} – {entry.item.startDate} to {entry.item.endDate}</p>
                                    </div>
                                  )}
                                  {entry.type === 'work' && (
                                    <div>
                                      <p className="font-semibold">{entry.item.title} at {entry.item.company}</p>
                                      <p className="text-xs">{entry.item.location}, {entry.item.startDate}–{entry.item.endDate}</p>
                                    </div>
                                  )}
                                  {entry.type === 'skills' && (
                                    <p>{entry.item.name} – {entry.item.level}</p>
                                  )}
                                  {entry.type === 'links' && (
                                    <a href={entry.item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                      {entry.item.label}
                                    </a>
                                  )}
                                  {entry.type === 'additional' && (
                                    <p>
                                      <strong>{formatFieldName(entry.item.key)}:</strong> {formatCvValue(entry.item.key, entry.item.value)}
                                    </p>
                                  )}
                                </li>
                              )}
                            </SortableItem>
                          ))}
                        </ul>
                      </SortableContext>
                    </DndContext>
                  </div>
                </SortableSection>
              ) : null
            )}
          </SortableContext>
        </DndContext>
      </div>
    );
  };
  
  export default CompactTemplate;
  