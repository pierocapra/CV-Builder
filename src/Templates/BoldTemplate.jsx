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
  
  const BoldTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
    const headerClasses = {
      gray: 'bg-gray-500 text-white',
      sky: 'bg-sky-600 text-white',
      teal: 'bg-teal-600 text-white',
      red: 'bg-red-500 text-white',
      cyan: 'bg-cyan-600 text-white',
    };
  
    const sectionClasses = {
      gray: 'border-t-4 border-gray-500',
      sky: 'border-t-4 border-sky-600',
      teal: 'border-t-4 border-teal-600',
      red: 'border-t-4 border-red-500',
      cyan: 'border-t-4 border-cyan-600',
    };
  
    const textClasses = {
      gray: 'text-gray-500',
      sky: 'text-sky-600',
      teal: 'text-teal-600',
      red: 'text-red-500',
      cyan: 'text-cyan-600',
    };
  
    // Filter out summary from sections to be rendered in main content
    const mainSections = sectionOrder.filter(sectionKey => sectionKey !== 'summary');
  
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
      <div className="bg-white p-6 font-sans text-gray-900">
        {/* Header */}
        <header className={`p-6 mb-8 ${headerClasses[color]} rounded-xl shadow-2xl relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 transform rotate-45 scale-150">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-20 w-[200%] border-t border-white/20"
                  style={{ top: `${i * 40}px`, left: '-50%' }}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold tracking-wide uppercase text-center mb-2">
              {cvData.personal.firstName}{' '}
              <span className="opacity-90">{cvData.personal.lastName}</span>
            </h1>
            <p className="mt-1 text-lg italic text-center font-light">{cvData.personal.title}</p>
            
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-gray-200">
              {Object.entries(cvData.personal)
                .filter(([key]) => !['firstName', 'lastName', 'title'].includes(key))
                .map(([key, value]) => (
                  <p key={key} className="flex items-center">
                    <span className="capitalize font-semibold mr-1">{key}:</span>
                    <span className="opacity-90">{value}</span>
                  </p>
                ))}
            </div>

            {groupedItems.summary?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/20">
                {groupedItems.summary.map((entry) => (
                  <p key={entry.id} className="text-sm leading-relaxed text-gray-100 font-light text-center italic">
                    {entry.item.value}
                  </p>
                ))}
              </div>
            )}
          </div>
        </header>
  
        {/* CV Sections */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={mainSections} strategy={verticalListSortingStrategy}>
            {mainSections.map((sectionKey) =>
              groupedItems[sectionKey]?.length ? (
                <SortableSection key={sectionKey} id={sectionKey}>
                  <div className={`mb-8 ${sectionClasses[color]} p-5 rounded-xl shadow-lg hover:outline hover:outline-1 hover:outline-dashed hover:outline-gray-400`}>
                    <h2 className={`text-xl font-bold ${textClasses[color]} mb-3 capitalize`}>
                      {sectionKey === 'summary' ? 'Professional Summary' : 
                       sectionKey === 'additional' ? 'Additional Info' : 
                       sectionKey}
                    </h2>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, sectionKey)}>
                      <SortableContext items={groupedItems[sectionKey].map(item => item.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                          {sectionKey === 'skills' ? (
                            renderSkills(groupedItems[sectionKey])
                          ) : (
                          groupedItems[sectionKey].map((entry) => (
                            <SortableItem key={entry.id} id={entry.id}>
                              <div className={`bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition-all`}>
                                {entry.type === 'education' && (
                                  <div>
                                    <p className="font-semibold text-base">{entry.item.degree} in {entry.item.field}</p>
                                    <p className="italic text-sm">{entry.item.school}, {entry.item.location}</p>
                                    <p className="text-xs text-gray-600">{entry.item.startDate} – {entry.item.endDate}</p>
                                  </div>
                                )}
                                {entry.type === 'work' && (
                                  <div>
                                    <p className="font-semibold text-base">{entry.item.title} at {entry.item.company}</p>
                                    <p className="italic text-sm">{entry.item.location}</p>
                                    <p className="text-xs text-gray-600">{entry.item.startDate} – {entry.item.endDate}</p>
                                    <p className="text-sm mt-1">{entry.item.description}</p>
                                  </div>
                                )}
                                {entry.type === 'skills' && (
                                  <p className="text-sm text-gray-700">{entry.item.name} · {entry.item.level}</p>
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
                              </div>
                            </SortableItem>
                          )))}
                        </div>
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
  
  export default BoldTemplate;
  