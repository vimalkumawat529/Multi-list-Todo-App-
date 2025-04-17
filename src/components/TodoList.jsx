import React, { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";

const TodoList = ({
    list,
    onAddTask,
    onDeleteTask,
    onToggleTask,
    onDeleteList,
    onRenameList,
    onDropTask,
    onReorderTask,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [newListName, setNewListName] = useState(list?.name || "");
    const inputRef = useRef(null);

    // Focus on the rename input when editing
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // Drag and drop functionality to handle task dropping into lists
    const [{ isOver }, dropRef] = useDrop({
        accept: "TASK",
        drop: (item) => {
            try {
                if (item?.fromListId !== list?.id) {
                    onDropTask(item?.taskId, item?.fromListId, list?.id);
                }
            } catch (error) {
                console.error("Error handling drop task:", error);
            }
        },
        collect: (monitor) => ({
            isOver: monitor?.isOver(),
        }),
    });

    // Handle renaming of the list
    const handleRename = () => {
        try {
            if (newListName.trim()) {
                onRenameList(list?.id, newListName?.trim());
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error renaming list:", error);
        }
    };

    // Move tasks within the same list (reordering tasks)
    const moveTask = (fromIndex, toIndex) => {
        try {
            const updatedTasks = [...list?.tasks];
            const [movedTask] = updatedTasks.splice(fromIndex, 1);
            updatedTasks.splice(toIndex, 0, movedTask);
            onReorderTask(list?.id, updatedTasks);
        } catch (error) {
            console.error("Error moving task:", error);
        }
    };

    return (
        <div ref={dropRef} className={`todolist ${isOver ? "dropping" : ""}`}>
            <div className="todolist-header">
                {isEditing ? (
                    <div className="rename-input">
                        <input
                            type="text"
                            ref={inputRef}
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                        />
                        <button className="update-rename" onClick={handleRename}>Update</button>
                    </div>
                ) : (
                    <h2>{list?.name}</h2>
                )}
                <div className="todolist-actions">
                    <button onClick={() => onDeleteList(list?.id)}>🗑️</button>
                    <button onClick={() => setIsEditing(true)}>✏️</button>
                </div>
            </div>

            <div className="task-input">
                <input
                    type="text"
                    value={taskName}
                    placeholder="Add a new task"
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <button
                    onClick={() => {
                        try {
                            if (taskName?.trim()) {
                                onAddTask(list?.id, taskName?.trim());
                                setTaskName("");
                            }
                        } catch (error) {
                            console.error("Error adding task:", error);
                        }
                    }}
                >
                    Add
                </button>
            </div>

            <div className="task-list">
                {list?.tasks?.map((task, index) => (
                    <Task
                        key={task?.id}
                        task={task}
                        listId={list?.id}
                        index={index}
                        moveTask={moveTask}
                        onToggleTask={(taskId) => onToggleTask(list?.id, taskId)}
                        onDeleteTask={(taskId) => onDeleteTask(list?.id, taskId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TodoList;
