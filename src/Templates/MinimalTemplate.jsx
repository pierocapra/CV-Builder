import {
    DndContext,
    closestCenter,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    verticalListSortingStrategy
  } from '@dnd-kit/sortable';
  
  import { SortableItem, SortableSection } from "../Utils/DndUtils.jsx";
  
  const MinimalTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
    const textClasses = {
      sky: 'text-sky-700',
      teal: 'text-teal-700',
      red: 'text-red-500',
      cyan: 'text-cyan-700',
    };
  
    return (
      <div className="bg-white p-8 font-sans text-gray-900">
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
                  <div className="mb-6 group border border-transparent hover:border-dashed hover:border-gray-400 rounded hover:cursor-move rounded p-2 transition">
                    <h2 className={`text-xl ${textClasses[color]} font-semibold mb-2 capitalize`}>
                      {sectionKey}
                    </h2>
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
                                  <p>{entry.item.name} – {entry.item.level}</p>
                                )}
                                {entry.type === 'links' && (
                                  <a href={entry.item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
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
  
  export default MinimalTemplate;
  