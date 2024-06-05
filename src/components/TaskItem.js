import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useDrag } from 'react-dnd';
import { doc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

function TaskItem({ task, onDeleteTask }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TASK',
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [task]);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [severity, setSeverity] = useState(task.severity);
    const [assignedTo, setAssignedTo] = useState(task.assignedTo || "");
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await getDocs(collection(db, 'users'));
            const usersData = usersCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setUsersList(usersData);
        };

        fetchUsers();
    }, []);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleChangeSeverity = async (newSeverity) => {
        const taskDoc = doc(db, 'tasks', task.id);
        await updateDoc(taskDoc, { severity: newSeverity });
        setSeverity(newSeverity);  // Update local state
    };

    const handleDelete = async () => {
        try {
            const taskDoc = doc(db, 'tasks', task.id);
            await deleteDoc(taskDoc);
            onDeleteTask(task.id);
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const taskDoc = doc(db, 'tasks', task.id);
        await updateDoc(taskDoc, { title, description, severity, assignedTo });
        handleClose();
    };

    return (
        <>
            <Card ref={drag} className="mb-2" style={{ opacity: isDragging ? 0.5 : 1 }}>
                <Card.Body>
                    <Card.Title>{task.title}</Card.Title>
                    <Card.Text>{task.description}</Card.Text>
                    <Card.Text><strong>Severity:</strong> {severity}</Card.Text>
                    <Card.Text><strong>Status:</strong> {task.status}</Card.Text>
                    <Card.Text><strong>Assigned To:</strong> {assignedTo}</Card.Text>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleChangeSeverity('Low')}
                            >
                                Low
                            </Button>
                            <Button
                                variant="outline-warning"
                                size="sm"
                                className="mx-1"
                                onClick={() => handleChangeSeverity('Medium')}
                            >
                                Medium
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleChangeSeverity('High')}
                            >
                                High
                            </Button>
                        </div>
                        <div>
                            <Button variant="primary" size="sm" onClick={handleShow} className="mr-1">
                                Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="severity">
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
                        <Form.Group controlId="assignedTo">
                            <Form.Label>Assigned To</Form.Label>
                            <Form.Control
                                as="select"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {usersList.map(user => (
                                    <option key={user.id} value={user.username}>{user.username}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Task
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default TaskItem;
