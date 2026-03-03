import { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import apiClient from '../../../api/apiClient';

const FundCard = ({ fund, userBalance, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleSubscribe = async () => {
        setLoading(true);
        setMsg(null);
        try {
            const res = await apiClient.post(`/funds/${fund.id}/subscribe`);
            setMsg({ type: 'success', text: `Suscripción exitosa a ${fund.name}` });
            onUpdate();
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error al suscribirse' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: '1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{
                        fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.625rem',
                        borderRadius: '20px', background: fund.category === 'FPV' ? '#ebf8ff' : '#f0fff4',
                        color: fund.category === 'FPV' ? '#2b6cb0' : '#276749'
                    }}>
                        {fund.category}
                    </span>
                    <TrendingUp size={18} color="#cbd5e0" />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', minHeight: '3rem' }}>{fund.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Vinculación mínima:</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                    COP ${fund.minAmount.toLocaleString()}
                </p>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                {msg && (
                    <p style={{
                        fontSize: '0.8125rem', marginBottom: '0.75rem',
                        color: msg.type === 'success' ? 'var(--success)' : 'var(--error)',
                        display: 'flex', alignItems: 'center'
                    }}>
                        {msg.type === 'success' ? <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> : <AlertCircle size={14} style={{ marginRight: '4px' }} />}
                        {msg.text}
                    </p>
                )}
                <button
                    className="btn btn-primary btn-block"
                    onClick={handleSubscribe}
                    disabled={loading || userBalance < fund.minAmount}
                    style={{ opacity: userBalance < fund.minAmount ? 0.6 : 1 }}
                >
                    {loading ? 'Procesando...' : userBalance < fund.minAmount ? 'Saldo Insuficiente' : 'Suscribirse'}
                </button>
            </div>
        </div>
    );
};

const FundList = ({ userBalance, onUpdate }) => {
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFunds = async () => {
            try {
                const res = await apiClient.get('/funds');
                setFunds(res.data.data);
            } catch (err) {
                console.error('Error fetching funds:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFunds();
    }, []);

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando portafolio de fondos...</p>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {funds.map(fund => (
                <FundCard key={fund.id} fund={fund} userBalance={userBalance} onUpdate={onUpdate} />
            ))}
        </div>
    );
};

export default FundList;
