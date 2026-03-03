import { useState, useEffect } from 'react';
import RegisterForm from './features/onboarding/components/RegisterForm';
import FundList from './features/funds/components/FundList';
import TransactionList from './features/transactions/components/TransactionList';
import apiClient from './api/apiClient';
import { LogOut, Wallet, UserCircle2, Landmark } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem(import.meta.env.VITE_USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user, refreshTrigger]);

  const fetchBalance = async () => {
    try {
      const res = await apiClient.get('/balance');
      setBalance(res.data.data.balance);
    } catch (err) {
      console.error('Fetch balance error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(import.meta.env.VITE_USER_STORAGE_KEY);
    setUser(null);
  };

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  if (!user) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
        <RegisterForm onRegisterSuccess={(u) => setUser(u)} />
      </div>
    );
  }

  return (
    <div style={{ background: '#f4f7fa', minHeight: '100vh' }}>
      {/* Premium Navbar */}
      <nav style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Landmark size={28} style={{ color: 'var(--primary)', marginRight: '12px' }} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>BTG Pactual <span style={{ fontWeight: '400', color: '#94a3b8' }}>Funds</span></h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Saldo Disponible</span>
              <span style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--primary)' }}>COP ${balance.toLocaleString()}</span>
            </div>
            <div style={{ height: '32px', width: '1px', background: '#e2e8f0' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.username}</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</p>
              </div>
              <UserCircle2 size={32} style={{ color: '#cbd5e0' }} />
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: '8px' }}
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{ padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
          <Wallet size={24} style={{ color: 'var(--primary)', marginRight: '12px' }} />
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Portafolio de Inversión</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Elige el fondo que mejor se adapte a tus metas financieras.</p>
          </div>
        </div>

        <FundList userBalance={balance} onUpdate={triggerRefresh} />

        <TransactionList key={refreshTrigger} />
      </main>
    </div>
  );
}

export default App;
