import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addList } from '../redux/todoSlice';

const ListManager = () => {
    const [listName, setListName] = useState('');
    const dispatch = useDispatch();

    const handleAddList = () => {
        try {
            if (listName?.trim()) {
                dispatch(addList(listName?.trim()));
                setListName('');
            }
        } catch (error) {
            console.error("Error adding list:", error);
        }
    };

    return (
        <div className="list-manager">
            <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Add new list..."
                className="list-input"
            />
            <button onClick={handleAddList} className="add-list-btn">
                Add List
            </button>
        </div>
    );
};

export default ListManager;
