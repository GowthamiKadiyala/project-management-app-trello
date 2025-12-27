import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: "white",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    cursor: "grab",
    touchAction: "none", // Required for touch screens
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {task.content}
    </div>
  );
}
