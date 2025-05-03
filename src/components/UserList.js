import React, { useEffect, useState } from 'react';
import { Table, message, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { ENDPOINTS } from '../config/apiConfig';
import CreateUser from './CreateUser';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate(); // Inicializar useNavigate

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch(ENDPOINTS.USERS, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
                message.error('No se pudo cargar la lista de usuarios.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const response = await fetch(`${ENDPOINTS.USERS}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado del usuario');
            }

            message.success(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} correctamente`);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, isActive: !currentStatus } : user
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado del usuario:', error);
            message.error('No se pudo actualizar el estado del usuario.');
        }
    };

    const handleUserCreatedOrUpdated = (user) => {
        if (isEditMode) {
            setUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === user.id ? { ...u, ...user } : u))
            );
        } else {
            setUsers((prevUsers) => [...prevUsers, user]);
        }
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedUser(null);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        // Aquí puedes limpiar el token o cualquier dato de sesión si es necesario
        navigate('/'); // Redirigir al inicio
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nombre Completo',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Fecha de Creación',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => new Date(createdAt).toLocaleDateString(),
        },
        {
            title: 'Activo',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (isActive ? 'Sí' : 'No'),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        style={{ marginRight: 8 }}
                        onClick={() => handleEditUser(record)}
                    >
                        Editar
                    </Button>
                    <Button
                        type="primary"
                        danger={record.isActive}
                        onClick={() => toggleUserStatus(record.id, record.isActive)}
                    >
                        {record.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Lista de Usuarios Registrados</h2>
                <Button type="primary" danger onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </div>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => {
                    setIsEditMode(false);
                    setSelectedUser(null);
                    setIsModalOpen(true);
                }}
            >
                Crear Usuario
            </Button>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                bordered
            />
            <CreateUser
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                onUserCreated={handleUserCreatedOrUpdated}
                isEditMode={isEditMode}
                selectedUser={selectedUser}
            />
        </div>
    );
};

export default UserList;