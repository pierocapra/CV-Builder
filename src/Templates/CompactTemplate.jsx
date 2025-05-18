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
  
  const CompactTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
    const headingClasses = {
      gray: 'border-b-2 border-gray-500 text-gray-500',
      sky: 'border-b-2 border-sky-500 text-sky-700',
      teal: 'border-b-2 border-teal-500 text-teal-700',
      red: 'border-b-2 border-red-400 text-red-600',
      cyan: 'border-b-2 border-cyan-500 text-cyan-700',
    };
  
    return (
      <div className="bg-white p-5 font-sans text-gray-900 text-sm">
        {/* Header */}
        {cvData.personal && (
          <header className="mb-4 pb-2">
            <h1 className="text-xl font-bold">
              {cvData.personal.firstName} {cvData.personal.lastName}
            </h1>
            <div className="text-xs text-gray-600 mt-0.5">
              {Object.entries(cvData.personal)
                .filter(([key]) => key !== 'firstName' && key !== 'lastName')
                .map(([key, value]) => (
                  <p key={key}>
                    {key}: {formatCvValue(key, value)}
                  </p>
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
                  <div className="mb-4 border border-transparent hover:border-dashed hover:border-gray-400 rounded hover:cursor-move">
                    {sectionKey !== 'additional' ? (
                      <h2 className={`text-base font-semibold ${headingClasses[color]} mb-2 capitalize`}>
                        {sectionKey === 'summary' ? 'Professional Summary' : 
                         sectionKey === 'additional' ? 'Additional Info' : 
                         sectionKey}
                      </h2>
                    ) : (
                      <h2 className={`text-base font-semibold uppercase tracking-wide mb-1 ${headingClasses[color]}`}>Additional Info</h2>
                    )}
                    {sectionKey === 'skills' ? (
                      renderSkills(groupedItems[sectionKey])
                    ) : (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, sectionKey)}>
                        <SortableContext items={groupedItems[sectionKey].map(item => item.id)} strategy={verticalListSortingStrategy}>
                          <ul className="space-y-1">
                            {groupedItems[sectionKey].map((entry) => (
                              <SortableItem key={entry.id} id={entry.id}>
                                {entry.type === 'summary' ? (
                                  <li className="pl-0">
                                    <p className="text-sm leading-relaxed text-gray-700 pl-3 border-l border-gray-400">{entry.item.value}</p>
                                  </li>
                                ) : (
                                  <li className="relative pl-3 rounded">
                                    <span className="absolute left-0 top-2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></span>
                                    {entry.type === 'education' && (
                                      <div>
                                        <p className="font-medium text-sm">{entry.item.degree}</p>
                                        <p className="text-xs">{entry.item.school} – {
                                          new Date(entry.item.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })} to {
                                          entry.item.endDate === 'Present' ? 'Present' :
                                          new Date(entry.item.endDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                                        }</p>
                                      </div>
                                    )}
                                    {entry.type === 'work' && (
                                      <div>
                                        <p className="font-medium text-sm">{entry.item.title} at {entry.item.company}</p>
                                        <p className="text-xs">{entry.item.location}, {
                                          new Date(entry.item.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })} – {
                                          entry.item.endDate === 'Present' ? 'Present' :
                                          new Date(entry.item.endDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                                        }</p>
                                      </div>
                                    )}
                                    {entry.type === 'skills' && (
                                      <p className="text-xs text-gray-700">{entry.item.name} · {entry.item.level}</p>
                                    )}
                                    {entry.type === 'links' && (
                                      <p className="text-xs">
                                        <strong>{entry.item.label}:</strong> {entry.item.url}
                                      </p>
                                    )}
                                    {entry.type === 'additional' && (
                                      <p className="text-xs">
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
  
  export default CompactTemplate;
  