import { useState } from 'react';
import { User, Mail, Smartphone, Bell, ArrowRight } from 'lucide-react';
import apiClient from '../../../api/apiClient';

const RegisterForm = ({ onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        notificationPreference: 'EMAIL',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Register in Backend
            const response = await apiClient.post('/register', {
                email: formData.email,
                username: formData.username,
                phone: formData.phone,
                notificationPreference: formData.notificationPreference
            });

            // The backend returns { user: { id, email, username... }, token: "..." }
            const { user, token } = response.data.data;
            const fullUserData = { ...user, token };

            // 1. Store in local storage (including the token for the interceptor)
            localStorage.setItem(import.meta.env.VITE_USER_STORAGE_KEY, JSON.stringify(fullUserData));

            // 2. Callback to parent
            onRegisterSuccess(fullUserData);
        } catch (err) {
            console.error('Registration failed:', err);
            setError('Error al registrar usuario. Intenta de nuevo.');
            localStorage.removeItem(import.meta.env.VITE_USER_STORAGE_KEY);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card fade-in" style={{ maxWidth: '450px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Bienvenido a BTG Pactual</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Plataforma de Gestión de Fondos</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre Completo</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Juan Perez"
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Correo Electrónico</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="juan@email.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Teléfono / WhatsApp</label>
                    <div style={{ position: 'relative' }}>
                        <Smartphone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="+57 300..."
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Preferencia de Notificación</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <label style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
                            border: `2px solid ${formData.notificationPreference === 'EMAIL' ? 'var(--primary)' : '#e2e8f0'}`,
                            background: formData.notificationPreference === 'EMAIL' ? 'rgba(0, 45, 93, 0.05)' : '#fff'
                        }}>
                            <input
                                type="radio" name="notificationPreference" value="EMAIL" style={{ display: 'none' }}
                                onChange={handleChange} checked={formData.notificationPreference === 'EMAIL'}
                            />
                            <Mail size={16} /> <span style={{ marginLeft: '8px' }}>Email</span>
                        </label>
                        <label style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
                            border: `2px solid ${formData.notificationPreference === 'SMS' ? 'var(--primary)' : '#e2e8f0'}`,
                            background: formData.notificationPreference === 'SMS' ? 'rgba(0, 45, 93, 0.05)' : '#fff'
                        }}>
                            <input
                                type="radio" name="notificationPreference" value="SMS" style={{ display: 'none' }}
                                onChange={handleChange} checked={formData.notificationPreference === 'SMS'}
                            />
                            <Smartphone size={16} /> <span style={{ marginLeft: '8px' }}>SMS</span>
                        </label>
                    </div>
                </div>

                {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? 'Inicializando...' : 'Comenzar Ahora'}
                    <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
