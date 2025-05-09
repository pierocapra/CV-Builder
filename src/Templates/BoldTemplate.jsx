import {
    DndContext,
    closestCenter,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    verticalListSortingStrategy
  } from '@dnd-kit/sortable';
  
  import { SortableItem, SortableSection } from "../Utils/DndUtils.jsx";
  
  const BoldTemplate = ({ cvData, groupedItems, handleDragEnd, sensors, handleSectionDragEnd, sectionOrder, color }) => {
    const headerClasses = {
      sky: 'bg-sky-700 text-white',
      teal: 'bg-teal-700 text-white',
      red: 'bg-red-700 text-white',
      cyan: 'bg-cyan-700 text-white',
    };
  
    const sectionClasses = {
      sky: 'border-t-4 border-sky-600',
      teal: 'border-t-4 border-teal-600',
      red: 'border-t-4 border-red-600',
      cyan: 'border-t-4 border-cyan-600',
    };
  
    const textClasses = {
      sky: 'text-sky-800',
      teal: 'text-teal-800',
      red: 'text-red-800',
      cyan: 'text-cyan-800',
    };
  
    return (
      <div className="bg-white p-10 font-sans text-gray-900">
        {/* Header */}
        {cvData.personal && (
          <header className={`p-8 mb-12 ${headerClasses[color]} text-center`}>
            <h1 className="text-5xl font-extrabold tracking-wide uppercase">
              {cvData.personal.firstName} {cvData.personal.lastName}
            </h1>
            <p className="mt-2 text-lg italic">{cvData.personal.title}</p>
            <div className="mt-4 text-sm text-gray-200">
              {Object.entries(cvData.personal)
                .filter(([key]) => key !== 'firstName' && key !== 'lastName')
                .map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
            </div>
          </header>
        )}
  
        {/* CV Sections */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((sectionKey) =>
              groupedItems[sectionKey]?.length ? (
                <SortableSection key={sectionKey} id={sectionKey}>
                  <div className={`mb-12 ${sectionClasses[color]} p-6 rounded-xl shadow-lg hover:outline hover:outline-1 hover:outline-dashed hover:outline-gray-400`}>
                    <h2 className={`text-3xl font-bold ${textClasses[color]} mb-4 capitalize`}>
                      {sectionKey}
                    </h2>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, sectionKey)}>
                      <SortableContext items={groupedItems[sectionKey].map(item => item.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-6">
                          {groupedItems[sectionKey].map((entry) => (
                            <SortableItem key={entry.id} id={entry.id}>
                              <div className={`bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all`}>
                                {entry.type === 'education' && (
                                  <div>
                                    <p className="font-semibold text-lg">{entry.item.degree} in {entry.item.field}</p>
                                    <p className="italic">{entry.item.school}, {entry.item.location}</p>
                                    <p className="text-sm text-gray-600">{entry.item.startDate} – {entry.item.endDate}</p>
                                  </div>
                                )}
                                {entry.type === 'work' && (
                                  <div>
                                    <p className="font-semibold text-lg">{entry.item.title} at {entry.item.company}</p>
                                    <p className="italic">{entry.item.location}</p>
                                    <p className="text-sm text-gray-600">{entry.item.startDate} – {entry.item.endDate}</p>
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
  
  export default BoldTemplate;
  