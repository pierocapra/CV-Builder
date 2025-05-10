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

  return (
    <div className="bg-white p-10 font-serif text-gray-800 leading-relaxed">
        {/* Header */}
      {cvData.personal && (
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            {cvData.personal.firstName} {cvData.personal.lastName}
          </h1>
          <div className="mt-2 text-sm text-gray-600">
            {Object.entries(cvData.personal)
              .filter(([key]) => key !== 'firstName' && key !== 'lastName')
              .map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
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
          <div className="mb-10 border border-transparent hover:border-dashed hover:border-gray-400 rounded hover:cursor-move">
            <h2 className={`text-2xl border-b pb-1 mb-4 ${textClasses[color]} font-semibold capitalize`}>
              {sectionKey}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, sectionKey)}
            >
              <SortableContext
                items={groupedItems[sectionKey].map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {groupedItems[sectionKey].map((entry) => (
                    <SortableItem key={entry.id} id={entry.id}>
                      <div className={`border-l-4 ${borderClasses[color]}  pl-4 py-2 hover:bg-indigo-50 rounded`}>
                        {entry.type === 'additional' && (
                          <p><strong>{entry.item.key}:</strong> {entry.item.value}</p>
                        )}
                        {entry.type === 'education' && (
                          <div>
                            <h3 className="font-semibold text-lg">{entry.item.degree} in {entry.item.field}</h3>
                            <p className="italic">{entry.item.school}, {entry.item.location}</p>
                            <p className="text-sm">{entry.item.startDate} – {entry.item.endDate}</p>
                          </div>
                        )}
                        {entry.type === 'work' && (
                          <div>
                            <h3 className="font-semibold text-lg">{entry.item.title}</h3>
                            <p className="italic">{entry.item.company}, {entry.item.location}</p>
                            <p className="text-sm">{entry.item.startDate} – {entry.item.endDate}</p>
                            <p>{entry.item.description}</p>
                          </div>
                        )}
                        {entry.type === 'skills' && (
                          <p><strong>{entry.item.name}</strong> – {entry.item.level}</p>
                        )}
                        {entry.type === 'links' && (
                          <p>
                            <a
                              href={entry.item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${textClasses[color]}  underline`}
                            >
                              {entry.item.label}
                            </a>
                          </p>
                        )}
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
          </SortableSection>) : null)}

</SortableContext>
</DndContext>
    </div>
  );
};

export default ElegantTemplate;
