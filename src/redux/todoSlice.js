import { createSlice } from '@reduxjs/toolkit';

const saveToLocalStorage = (lists) => {
    try {
        localStorage.setItem('todoLists', JSON.stringify(lists));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};

const initialState = {
    lists: (() => {
        try {
            return JSON.parse(localStorage.getItem('todoLists')) || [];
        } catch (error) {
            console.error("Error loading from localStorage:", error);
            return [];
        }
    })(),
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addList: (state, action) => {
            const newList = {
                id: Date.now(),
                name: action.payload,
                tasks: [],
            };
            state.lists.push(newList);
            saveToLocalStorage(state?.lists);
        },
        deleteList: (state, action) => {
            state.lists = state?.lists?.filter(list => list?.id !== action.payload);
            saveToLocalStorage(state?.lists);
        },
        addTask: (state, action) => {
            const { listId, taskName } = action.payload;
            const list = state?.lists?.find(list => list?.id === listId);
            if (list) {
                list.tasks.push({ id: Date.now(), name: taskName, completed: false });
                saveToLocalStorage(state?.lists);
            }
        },
        deleteTask: (state, action) => {
            const { listId, taskId } = action.payload;
            const list = state?.lists?.find(list => list?.id === listId);
            if (list) {
                list.tasks = list?.tasks?.filter(task => task?.id !== taskId);
                saveToLocalStorage(state?.lists);
            }
        },
        toggleTaskCompletion: (state, action) => {
            const { listId, taskId } = action.payload;
            const list = state?.lists?.find(list => list?.id === listId);
            const task = list?.tasks?.find(task => task?.id === taskId);
            if (task) {
                task.completed = !task?.completed;
                saveToLocalStorage(state?.lists);
            }
        },
        reorderTasks: (state, action) => {
            const { listId, tasks } = action.payload;
            const list = state?.lists?.find(list => list?.id === listId);
            if (list) {
                list.tasks = tasks;
                saveToLocalStorage(state?.lists);
            }
        },
    },
});

export const {
    addList,
    deleteList,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    reorderTasks,
} = todoSlice.actions;

export default todoSlice.reducer;
