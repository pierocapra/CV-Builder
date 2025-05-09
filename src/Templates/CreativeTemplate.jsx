import {
    DndContext,
    closestCenter,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    verticalListSortingStrategy
  } from '@dnd-kit/sortable';
  
  import { SortableItem, SortableSection } from "../Utils/DndUtils.jsx";
  
  const CreativeTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
    const headerClasses = {
      sky: 'bg-sky-500 text-white',
      teal: 'bg-teal-500 text-white',
      red: 'bg-red-500 text-white',
      cyan: 'bg-cyan-500 text-white',
    };
  
    const textClasses = {
      sky: 'text-sky-600',
      teal: 'text-teal-600',
      red: 'text-red-600',
      cyan: 'text-cyan-600',
    };
  
    return (
      <div className="bg-white p-8 font-serif text-gray-900">
        {/* Header */}
        {cvData.personal && (
          <header className={`p-6 mb-8 ${headerClasses[color]} rounded-lg text-center`}>
            <h1 className="text-4xl font-bold tracking-tight">
              {cvData.personal.firstName} {cvData.personal.lastName}
            </h1>
            <p className="mt-2 text-lg">{cvData.personal.title}</p>
            <div className="mt-4 text-sm text-gray-100">
              {Object.entries(cvData.personal)
                .filter(([key]) => key !== 'firstName' && key !== 'lastName')
                .map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
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
                  <div className="mb-8 group border border-transparent hover:border-dashed hover:border-gray-400 rounded  hover:cursor-move rounded-lg p-4">
                    <h2 className={`text-2xl font-semibold ${textClasses[color]} mb-3 capitalize`}>
                      {sectionKey}
                    </h2>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, sectionKey)}>
                      <SortableContext items={groupedItems[sectionKey].map(item => item.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                          {groupedItems[sectionKey].map((entry) => (
                            <SortableItem key={entry.id} id={entry.id}>
                              <div className="bg-gray-50 hover:bg-indigo-50 p-3 rounded-lg transition">
                                {entry.type === 'education' && (
                                  <div>
                                    <p className="font-semibold text-lg">{entry.item.degree} in {entry.item.field}</p>
                                    <p className="italic text-sm">{entry.item.school}, {entry.item.location}</p>
                                    <p className="text-xs text-gray-600">{entry.item.startDate} – {entry.item.endDate}</p>
                                  </div>
                                )}
                                {entry.type === 'work' && (
                                  <div>
                                    <p className="font-semibold text-lg">{entry.item.title} at {entry.item.company}</p>
                                    <p className="italic text-sm">{entry.item.location}</p>
                                    <p className="text-xs text-gray-600">{entry.item.startDate} – {entry.item.endDate}</p>
                                    <p>{entry.item.description}</p>
                                  </div>
                                )}
                                {entry.type === 'skills' && (
                                  <p><strong>{entry.item.name}</strong> – {entry.item.level}</p>
                                )}
                                {entry.type === 'links' && (
                                  <a href={entry.item.url} target="_blank" rel="noopener noreferrer" className={`${textClasses[color]} text-lg underline`}>
                                    {entry.item.label}
                                  </a>
                                )}
                                {entry.type === 'additional' && (
                                  <p><strong>{entry.item.key}:</strong> {entry.item.value}</p>
                                )}
                              </div>
                            </SortableItem>
                          ))}
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
  