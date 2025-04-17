import React from "react";
import { useDrag, useDrop } from "react-dnd";

const Task = ({ task, listId, index, moveTask, onToggleTask, onDeleteTask }) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: "TASK",
        item: { taskId: task?.id, fromListId: listId, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: "TASK",
        hover: (draggedItem, monitor) => {
            if (!monitor.isOver({ shallow: true })) return;

            if (
                draggedItem?.fromListId === listId &&
                draggedItem?.index !== index
            ) {
                moveTask(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => dragRef(dropRef(node))}
            className={`task ${isDragging ? "dragging" : ""}`}
            style={{ cursor: isDragging ? "move" : "pointer" }}
        >
            <input
                type="checkbox"
                checked={task?.completed}
                onChange={() => onToggleTask(task?.id)}
            />
            <span className={task?.completed ? "completed" : ""}>{task?.name}</span>
            <button onClick={() => onDeleteTask(task?.id)}>❌</button>
        </div>
    );
};

export default Task;
