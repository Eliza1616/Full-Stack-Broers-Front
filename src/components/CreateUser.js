import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { ENDPOINTS } from '../config/apiConfig';

const CreateUser = ({ isModalOpen, setIsModalOpen, onUserCreated, isEditMode, selectedUser }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditMode && selectedUser) {
            // Precargar los datos del usuario seleccionado, excepto la contraseña
            const { password, ...userDataWithoutPassword } = selectedUser;
            form.setFieldsValue(userDataWithoutPassword);
        } else {
            // Limpiar el formulario si no está en modo edición
            form.resetFields();
        }
    }, [isEditMode, selectedUser, form]);

    const handleCreateOrUpdateUser = async (values) => {
        try {
            const url = isEditMode
                ? `${ENDPOINTS.USERS}/${selectedUser.id}` // Endpoint para actualizar
                : ENDPOINTS.USERS; // Endpoint para crear

            const method = isEditMode ? 'PATCH' : 'POST'; // Método HTTP según el modo

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(isEditMode ? 'Error al actualizar el usuario' : 'Error al crear el usuario');
            }

            const user = await response.json();
            message.success(isEditMode ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
            onUserCreated(user); // Notificar al componente padre
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error(isEditMode ? 'No se pudo actualizar el usuario' : 'No se pudo crear el usuario');
        }
    };

    return (
        <Modal
            title={isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form form={form} onFinish={handleCreateOrUpdateUser} layout="vertical">
                {/* Nombre Completo */}
                <Form.Item
                    label="Nombre Completo"
                    name="fullName"
                    rules={[{ required: true, message: 'Por favor ingresa el nombre completo' }]}
                >
                    <Input />
                </Form.Item>

                {/* Correo */}
                <Form.Item
                    label="Correo"
                    name="email"
                    rules={[
                        { required: true, message: 'Por favor ingresa el correo' },
                        { type: 'email', message: 'Por favor ingresa un correo válido' },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* Contraseña */}
                <Form.Item
                    label="Clave"
                    name="password"
                    rules={[
                        !isEditMode && { required: true, message: 'Por favor ingresa una clave' },
                    ].filter(Boolean)} // La contraseña es obligatoria solo en modo creación
                >
                    <Input.Password placeholder={isEditMode ? 'Dejar vacío para no cambiar' : ''} />
                </Form.Item>

                {/* Activo */}
                <Form.Item
                    label="Activo"
                    name="isActive"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Input type="checkbox" />
                </Form.Item>

                {/* Botón de Crear/Actualizar */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        {isEditMode ? 'Actualizar' : 'Crear'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUser;