import React from 'react';
import { useDrop } from 'react-dnd';
import TaskItem from './TaskItem';
import { useTheme } from '../ThemeContext';

function TaskList({ status, tasks, onDropTask, onDeleteTask }) {
    const { theme } = useTheme();
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'TASK',
        drop: (item) => onDropTask(item.id, status),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} className={`tasklist-container ${isOver ? 'over' : ''} ${theme}`}>
            <h4 className="tasklist-title">{status}</h4>
            {tasks.length === 0 ? (
                <p className="no-tasks-text">NO TASKS</p>
            ) : (
                tasks.map(task => (
                    <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} />
                ))
            )}
        </div>
    );
}

export default TaskList;
