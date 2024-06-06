import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthProvider';
import { useTheme } from '../ThemeContext';

function TaskForm({ onClose }) {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('To Do');
    const [severity, setSeverity] = useState('Low');
    const [assignedTo, setAssignedTo] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await getDocs(collection(db, 'users'));
            const usersData = usersCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setUsers(usersData);
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'tasks'), {
                title,
                description,
                status,
                severity,
                assignedTo,
                uid: currentUser.uid,
            });
            setTitle('');
            setDescription('');
            setStatus('To Do');
            setSeverity('Low');
            setAssignedTo('');
            onClose();
        } catch (error) {
            console.error('Error adding task: ', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className={`task-form ${theme}`}>
            <Form.Group controlId="title" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                />
            </Form.Group>
            <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                />
            </Form.Group>
            <Form.Group controlId="status" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                    as="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="severity" className="mb-3">
                <Form.Label>Severity</Form.Label>
                <Form.Control
                    as="select"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="assignedTo" className="mb-3">
                <Form.Label>Assign to</Form.Label>
                <Form.Control
                    as="select"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                >
                    <option value="">Select user</option>
                    {users.map(user => (
                        <option key={user.id} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Task
            </Button>
        </Form>
    );
}

export default TaskForm;
