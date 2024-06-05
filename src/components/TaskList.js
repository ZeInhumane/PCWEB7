import React from 'react';
import { useDrop } from 'react-dnd';
import TaskItem from './TaskItem';
import { Card } from 'react-bootstrap';

function TaskList({ status, tasks, onDropTask, onDeleteTask }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'TASK',
        drop: (item) => onDropTask(item.id, status),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} style={{ backgroundColor: isOver ? '#e0e0e0' : 'white', padding: '20px', borderRadius: '10px', minHeight: '1000px' }}>
            <h4>{status}</h4>
            {tasks.length === 0 ? (
                <p>NO TASKS</p>
            ) : (
                tasks.map(task => (
                    <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} />
                ))
            )}
        </div>
    );
}

export default TaskList;
