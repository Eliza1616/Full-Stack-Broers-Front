import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { ENDPOINTS } from '../config/apiConfig';

const Login = () => {
  const navigate = useNavigate(); // Inicializar useNavigate

  const onFinish = async (values) => {
    console.log('Datos enviados:', values);
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error en la autenticación');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      // Almacenar el token JWT en localStorage
      localStorage.setItem('token', data.token);

      // Redirigir al listado de usuarios
      navigate('/user'); // Redirige a la ruta del listado
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Error en el inicio de sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>Iniciar Sesión</h2>
      <Form
        name="login"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Correo"
          name="email"
          rules={[{ required: true, message: 'Por favor ingresa tu correo!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Clave"
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu clave!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;