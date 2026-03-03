import { useState, useEffect } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Calendar, ShieldCheck } from 'lucide-react';
import apiClient from '../../../api/apiClient';

const TransactionList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await apiClient.get('/transactions');
                setData(res.data.data);
            } catch (err) {
                console.error('Error history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
        // In a real app we might use socket or regular polling
        const interval = setInterval(fetchHistory, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p style={{ textAlign: 'center', padding: '1rem' }}>Recuperando historial...</p>;

    return (
        <div className="glass-card fade-in" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <History size={20} style={{ marginRight: '10px' }} />
                <h2 style={{ fontSize: '1.25rem' }}>Mi Historial de Actividad</h2>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#718096' }}>ID / Referencia</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#718096' }}>Fondo</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#718096' }}>Tipo</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#718096' }}>Monto</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#718096' }}>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>No se registran transacciones.</td></tr>
                        ) : data.map((tx) => (
                            <tr key={tx.transactionId} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <ShieldCheck size={14} color="var(--success)" style={{ marginRight: '8px' }} />
                                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{tx.transactionId.substring(0, 13)}...</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{tx.fundName}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600',
                                        background: tx.type === 'OPEN' ? '#fff5f5' : '#f0fff4',
                                        color: tx.type === 'OPEN' ? '#c53030' : '#276749',
                                        display: 'inline-flex', alignItems: 'center'
                                    }}>
                                        {tx.type === 'OPEN' ? <ArrowUpRight size={12} style={{ marginRight: '4px' }} /> : <ArrowDownLeft size={12} style={{ marginRight: '4px' }} />}
                                        {tx.type === 'OPEN' ? 'Apertura' : 'Cancelación'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: '700', color: tx.type === 'OPEN' ? 'var(--error)' : 'var(--success)' }}>
                                    {tx.type === 'OPEN' ? '-' : '+'}${tx.amount.toLocaleString()}
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#718096' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Calendar size={12} style={{ marginRight: '6px' }} />
                                        {new Date(tx.date).toLocaleString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionList;
