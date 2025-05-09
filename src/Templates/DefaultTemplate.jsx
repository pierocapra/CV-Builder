import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
  } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';

    function SortableItem({ id, children }) {
      const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      } = useSortable({ id });
    
      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
      };
    
      return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          {children}
        </div>
      );
    }

const DefaultTemplate = ({ cvData, groupedItems, handleDragEnd, sensors }) => {
    return (
    <div className="bg-white p-6">
          {cvData.personal && (
            <>
              <h2 className="text-2xl font-bold mb-4">
                {cvData.personal.firstName} {cvData.personal.lastName}
              </h2>
              {Object.entries(cvData.personal)
                .filter(([key]) => key !== 'firstName' && key !== 'lastName')
                .map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
            </>
          )}

          {['additional', 'education', 'work', 'skills', 'links'].map((sectionKey) =>
            groupedItems[sectionKey]?.length ? (
              <div key={sectionKey} className="mt-6">
                <h3 className="text-xl text-sky-600 font-medium mb-2 capitalize">{sectionKey}</h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(event, sectionKey)} // adjust per section
                >
                  <SortableContext
                    items={groupedItems[sectionKey].map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {groupedItems[sectionKey].map((entry) => (
                      <SortableItem key={entry.id} id={entry.id}>
                        <div className="hover:shadow hover:bg-gray-100 rounded p-1 pl-2">
                          {entry.type === 'additional' && (
                              <p><strong>{entry.item.key}:</strong> {entry.item.value}</p>
                          )}
                          {entry.type === 'education' && (
                            <div>
                              <h3 className="font-semibold">{entry.item.degree} in {entry.item.field}</h3>
                              <p>{entry.item.school}, {entry.item.location}</p>
                              <p>{entry.item.startDate} – {entry.item.endDate}</p>
                            </div>
                          )}
                          {entry.type === 'work' && (
                            <div>
                              <h3 className="font-semibold">{entry.item.title}</h3>
                              <p>{entry.item.company}, {entry.item.location}</p>
                              <p>{entry.item.startDate} – {entry.item.endDate}</p>
                              <p>{entry.item.description}</p>
                            </div>
                          )}
                          {entry.type === 'skills' && (
                            <p>{entry.item.name} ({entry.item.level})</p>
                          )}
                          {entry.type === 'links' && (
                            <p>
                              <a href={entry.item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {entry.item.label}
                              </a>
                            </p>
                          )}
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            ) : null
          )}
        </div>
    )
}

export default DefaultTemplate