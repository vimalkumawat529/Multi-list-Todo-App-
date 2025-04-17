import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoList from "./components/TodoList";

const App = () => {
  const [todoLists, setTodoLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch saved todo lists from localStorage
  useEffect(() => {
    try {
      const savedLists = JSON.parse(localStorage.getItem("todoLists")) || [];
      setTodoLists(savedLists);
    } catch (error) {
      console.error("Failed to load todo lists from localStorage:", error);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter Todo Lists based on search query
  const filteredLists = searchQuery
    ? todoLists
      ?.map((list) => {
        const filteredTasks = list?.tasks?.filter((task) =>
          task.name.toLowerCase().includes(searchQuery)
        );
        return filteredTasks?.length > 0 ? { ...list, tasks: filteredTasks } : null;
      })
      ?.filter((list) => list !== null)
    : todoLists;


  // Handle Drag-and-Drop functionality
  const handleDropTask = (taskId, fromListId, toListId) => {
    if (fromListId === toListId) return;

    try {
      setTodoLists((prevLists) =>
        prevLists?.map((list) => {
          if (list?.id === fromListId) {
            return { ...list, tasks: list.tasks?.filter((t) => t?.id !== taskId) };
          }
          if (list?.id === toListId) {
            const movedTask = prevLists
              .find((l) => l.id === fromListId)
              ?.tasks?.find((t) => t?.id === taskId);
            return { ...list, tasks: [...list?.tasks, movedTask] };
          }
          return list;
        })
      );
    } catch (error) {
      console.error("Error during task drop:", error);
    }
  };

  // Add new task to a list
  const handleAddTask = (listId, taskName) => {
    try {
      const updatedLists = todoLists?.map((list) => {
        if (list?.id === listId) {
          const newTask = {
            id: Date.now(),
            name: taskName,
            completed: false,
          };
          list?.tasks.push(newTask);
        }
        return list;
      });
      setTodoLists(updatedLists);
      localStorage.setItem("todoLists", JSON.stringify(updatedLists));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle task completion status
  const handleToggleTask = (listId, taskId) => {
    try {
      const updatedLists = todoLists?.map((list) => {
        if (list.id === listId) {
          const task = list?.tasks?.find((task) => task?.id === taskId);
          if (task) {
            task.completed = !task.completed;
          }
        }
        return list;
      });
      setTodoLists(updatedLists);
      localStorage.setItem("todoLists", JSON.stringify(updatedLists));
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  // Delete a task from a list
  const handleDeleteTask = (listId, taskId) => {
    try {
      const updatedLists = todoLists?.map((list) => {
        if (list?.id === listId) {
          list.tasks = list.tasks?.filter((task) => task?.id !== taskId);
        }
        return list;
      });
      setTodoLists(updatedLists);
      localStorage.setItem("todoLists", JSON.stringify(updatedLists));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Add a new todo list
  const handleAddList = () => {
    if (newListName.trim()) {
      try {
        const newList = {
          id: Date.now(),
          name: newListName.trim(),
          tasks: [],
        };
        const updatedLists = [...todoLists, newList];
        setTodoLists(updatedLists);
        localStorage.setItem("todoLists", JSON.stringify(updatedLists));
        setNewListName("");
      } catch (error) {
        console.error("Error adding list:", error);
      }
    }
  };

  // Delete a todo list
  const handleDeleteList = (listId) => {
    try {
      const updatedLists = todoLists?.filter((list) => list.id !== listId);
      setTodoLists(updatedLists);
      localStorage.setItem("todoLists", JSON.stringify(updatedLists));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  // Rename a todo list
  const handleRenameList = (listId, newName) => {
    try {
      const updatedLists = todoLists?.map((list) =>
        list.id === listId ? { ...list, name: newName } : list
      );
      setTodoLists(updatedLists);
      localStorage.setItem("todoLists", JSON.stringify(updatedLists));
    } catch (error) {
      console.error("Error renaming list:", error);
    }
  };

  // Reorder tasks within a list
  const handleReorderTask = (listId, updatedTasks) => {
    try {
      const updatedLists = todoLists?.map((list) =>
        list?.id === listId ? { ...list, tasks: updatedTasks } : list
      );
      setTodoLists(updatedLists);
      localStorage.setItem("todoLists", JSON.stringify(updatedLists));
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="add-list-container">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter new list name"
          />
          <button onClick={handleAddList}>Add List</button>
        </div>

        {/* Search Bar */}
        {todoLists.length > 0 && <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
          />
          {searchQuery && (
            <button
              className="clear-btn"
              onClick={() => setSearchQuery("")}
              title="Clear"
            >
              ✖
            </button>
          )}
        </div>}

        {/* Lists Rendering */}
        <div className="lists">
          {filteredLists?.length > 0 ? (
            filteredLists.map((list) => (
              <TodoList
                key={list.id}
                list={list}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onToggleTask={handleToggleTask}
                onDeleteList={handleDeleteList}
                onRenameList={handleRenameList}
                onDropTask={handleDropTask}
                onReorderTask={handleReorderTask}
              />
            ))
          ) : searchQuery ? (
            <p>No tasks found matching "{searchQuery}"</p>
          ) : (
            <p>No lists available. Add a list!</p>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
