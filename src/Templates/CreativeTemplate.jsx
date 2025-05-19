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
  
  const CreativeTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
    const headerClasses = {
      gray: 'from-gray-500 to-gray-600',
      sky: 'from-sky-500 to-sky-700',
      teal: 'from-teal-500 to-teal-700',
      red: 'from-red-400 to-red-600',
      cyan: 'from-cyan-500 to-cyan-700',
    };
  
    const textClasses = {
      gray: 'text-gray-500',
      sky: 'text-sky-600',
      teal: 'text-teal-600',
      red: 'text-red-500',
      cyan: 'text-cyan-600',
    };

    const accentClasses = {
      gray: 'border-gray-400',
      sky: 'border-sky-400',
      teal: 'border-teal-400',
      red: 'border-red-400',
      cyan: 'border-cyan-400',
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
        <header className={`relative p-8 mb-8 bg-gradient-to-br ${headerClasses[color]} text-white rounded-2xl shadow-2xl overflow-hidden`}>
          {/* Creative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0">
              {/* Circles */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={`circle-${i}`}
                  className="absolute border-4 border-white/20 rounded-full"
                  style={{
                    width: `${80 + i * 30}px`,
                    height: `${80 + i * 30}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
              {/* Diagonal Lines */}
              <div className="absolute inset-0 transform -rotate-45">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`line-${i}`}
                    className="absolute h-px w-full bg-white/20"
                    style={{ top: `${i * 60}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Name and Title */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 font-serif">
                <span className="opacity-90">{cvData.personal.firstName}</span>
                <span className="mx-2 text-white/30"> </span>
                <span className="opacity-80">{cvData.personal.lastName}</span>
              </h1>
              <p className="text-lg font-light tracking-wide text-white/90">{cvData.personal.title}</p>
            </div>

            {/* Personal Info */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              {Object.entries(cvData.personal)
                .filter(([key]) => !['firstName', 'lastName', 'title'].includes(key))
                .map(([key, value]) => {
                  if (key === 'dateOfBirth') {
                    console.log('Date value:', value);
                    console.log('Formatted date:', new Date(value).toLocaleString('en-US', { month: 'long', year: 'numeric' }));
                  }
                  return (
                    <div
                      key={key}
                      className={`flex items-center px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border ${accentClasses[color]} border-opacity-20`}
                    >
                      <span className="capitalize font-medium mr-1">{key}:</span>
                      <span className="opacity-90">
                        {formatCvValue(key, value)}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Summary */}
            {groupedItems.summary?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/20">
                <div className="max-w-3xl mx-auto">
                  {groupedItems.summary.map((entry) => (
                    <p key={entry.id} className="text-sm leading-relaxed text-center font-light">
                      "{entry.item.value}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
  
        {/* Sections */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={mainSections} strategy={verticalListSortingStrategy}>
            {mainSections.map((sectionKey) =>
              groupedItems[sectionKey]?.length ? (
                <SortableSection key={sectionKey} id={sectionKey}>
                  <div className={`mb-5 group bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md 
                    hover:shadow-lg transition-all duration-300 border border-gray-100`}>
                    <h2 className={`text-lg font-serif font-semibold ${textClasses[color]} mb-3 capitalize flex items-center`}>
                      <span className="opacity-90">
                        {sectionKey === 'summary' ? 'Professional Summary' : 
                         sectionKey === 'additional' ? 'Additional Info' : 
                         sectionKey}
                      </span>
                    </h2>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, sectionKey)}>
                      <SortableContext items={groupedItems[sectionKey].map(item => item.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {sectionKey === 'skills' ? (
                            renderSkills(groupedItems[sectionKey])
                          ) : (
                          groupedItems[sectionKey].map((entry) => (
                            <SortableItem key={entry.id} id={entry.id}>
                              <div className={`p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-100
                                hover:border-${color}-200 hover:bg-white transition-all duration-200`}>
                                {entry.type === 'education' && (
                                  <div>
                                    <div className="flex items-baseline justify-between mb-0.5">
                                      <p className="font-semibold text-base">{entry.item.degree} in {entry.item.field}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(entry.item.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })} – {
                                          entry.item.endDate === 'Present' ? 'Present' :
                                          new Date(entry.item.endDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                                        }
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">{entry.item.school}, {entry.item.location}</p>
                                  </div>
                                )}
                                {entry.type === 'work' && (
                                  <div>
                                    <div className="flex items-baseline justify-between mb-0.5">
                                      <p className="font-semibold text-base">{entry.item.title} at {entry.item.company}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(entry.item.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })} – {
                                          entry.item.endDate === 'Present' ? 'Present' :
                                          new Date(entry.item.endDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                                        }
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-600 italic mb-1">{entry.item.location}</p>
                                    <p className="text-sm text-gray-700">{entry.item.description}</p>
                                  </div>
                                )}
                                {entry.type === 'skills' && (
                                  <p className="text-sm text-gray-700">{entry.item.name} · {entry.item.level}</p>
                                )}
                                {entry.type === 'links' && (
                                  <p className="text-sm">
                                    <span className="font-medium">{entry.item.label}:</span>{' '}
                                    <span className="text-gray-700">{entry.item.url}</span>
                                  </p>
                                )}
                                {entry.type === 'additional' && (
                                  <p className="text-sm">
                                    <span className="font-medium">{formatFieldName(entry.item.key)}:</span>{' '}
                                    <span className="text-gray-700">{formatCvValue(entry.item.key, entry.item.value)}</span>
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
  
  export default CreativeTemplate;
  