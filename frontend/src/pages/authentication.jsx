import * as React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const styles = {
    page: {
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        fontFamily: "'Inter', sans-serif",
    },
    leftPanel: {
        flex: 1,
        background: 'linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
    },
    leftGlow: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
    },
    leftContent: {
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        color: 'white',
        maxWidth: '380px',
    },
    leftLogo: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6366f1, #818cf8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        margin: '0 auto 1.5rem',
        boxShadow: '0 0 40px rgba(99,102,241,0.4)',
    },
    leftTitle: {
        fontSize: '2rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #38bdf8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem',
    },
    leftDesc: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: '1.7',
    },
    leftStats: {
        display: 'flex',
        gap: '2rem',
        marginTop: '2.5rem',
        justifyContent: 'center',
    },
    stat: {
        textAlign: 'center',
    },
    statNumber: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#a78bfa',
    },
    statLabel: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)',
        marginTop: '0.2rem',
    },
    rightPanel: {
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border)',
    },
    formHeader: {
        marginBottom: '2rem',
    },
    formTitle: {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '0.4rem',
    },
    formSubtitle: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
    },
    tabContainer: {
        display: 'flex',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '10px',
        padding: '4px',
        marginBottom: '1.8rem',
        border: '1px solid var(--border)',
    },
    tab: {
        flex: 1,
        padding: '0.6rem',
        borderRadius: '7px',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-secondary)',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    tabActive: {
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        marginBottom: '0.4rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.04)',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.2s ease',
    },
    errorText: {
        color: '#f87171',
        fontSize: '0.85rem',
        marginBottom: '0.5rem',
        padding: '0.6rem 0.9rem',
        background: 'rgba(239,68,68,0.08)',
        borderRadius: '8px',
        border: '1px solid rgba(239,68,68,0.2)',
    },
    submitBtn: {
        width: '100%',
        padding: '0.85rem',
        borderRadius: '10px',
        border: 'none',
        background: 'linear-gradient(135deg, #6366f1, #818cf8)',
        color: 'white',
        fontFamily: "'Inter', sans-serif",
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '1rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
    },
    snackbar: {
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--bg-card)',
        border: '1px solid rgba(34,197,94,0.3)',
        color: '#86efac',
        padding: '0.8rem 1.5rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '500',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        zIndex: 999,
    }
};

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleInputFocus = (e) => {
        e.target.style.borderColor = 'var(--primary)';
        e.target.style.background = 'rgba(99,102,241,0.06)';
        e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
    };
    const handleInputBlur = (e) => {
        e.target.style.borderColor = 'var(--border)';
        e.target.style.background = 'rgba(255,255,255,0.04)';
        e.target.style.boxShadow = 'none';
    };

    const switchTab = (tab) => {
        setFormState(tab);
        setError('');
        setUsername('');
        setPassword('');
        setName('');
    };

    let handleAuth = async () => {
        setError('');
        if (!username || !password) {
            setError('Please fill in all required fields.');
            return;
        }
        setLoading(true);
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                if (!name) { setError('Please enter your full name.'); setLoading(false); return; }
                let result = await handleRegister(name, username, password);
                setUsername('');
                setPassword('');
                setName('');
                setMessage(result || 'Registered successfully! You can now sign in.');
                setOpen(true);
                setFormState(0);
                setTimeout(() => setOpen(false), 4000);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAuth();
    };

    return (
        <div style={styles.page}>
            {/* Floating theme toggle */}
            <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 200 }}>
                <ThemeToggle />
            </div>
            {/* Left Panel */}
            <div style={styles.leftPanel}>
                <div style={styles.leftGlow}></div>
                <div style={styles.leftContent}>
                    <div style={styles.leftLogo}>🎥</div>
                    <div style={styles.leftTitle}>ConnectNow</div>
                    <p style={styles.leftDesc}>
                        Join thousands of people having seamless, high-quality video calls every day.
                        Free, secure, and browser-based.
                    </p>
                    <div style={styles.leftStats}>
                        <div style={styles.stat}>
                            <div style={styles.statNumber}>10K+</div>
                            <div style={styles.statLabel}>Daily Calls</div>
                        </div>
                        <div style={styles.stat}>
                            <div style={styles.statNumber}>99.9%</div>
                            <div style={styles.statLabel}>Uptime</div>
                        </div>
                        <div style={styles.stat}>
                            <div style={styles.statNumber}>Free</div>
                            <div style={styles.statLabel}>Always</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div style={styles.rightPanel}>
                <div style={styles.formHeader}>
                    <h1 style={styles.formTitle}>
                        {formState === 0 ? 'Welcome back 👋' : 'Create account 🚀'}
                    </h1>
                    <p style={styles.formSubtitle}>
                        {formState === 0
                            ? 'Sign in to your account to continue'
                            : 'Get started — it\'s completely free'}
                    </p>
                </div>

                {/* Tabs */}
                <div style={styles.tabContainer}>
                    <button
                        style={{ ...styles.tab, ...(formState === 0 ? styles.tabActive : {}) }}
                        onClick={() => switchTab(0)}
                    >Sign In</button>
                    <button
                        style={{ ...styles.tab, ...(formState === 1 ? styles.tabActive : {}) }}
                        onClick={() => switchTab(1)}
                    >Sign Up</button>
                </div>

                {/* Name field (sign up only) */}
                {formState === 1 && (
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            style={styles.input}
                        />
                    </div>
                )}

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        style={styles.input}
                    />
                </div>

                {error && <p style={styles.errorText}>⚠️ {error}</p>}

                <button
                    style={{
                        ...styles.submitBtn,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                    onClick={handleAuth}
                    disabled={loading}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(99,102,241,0.3)';
                    }}
                >
                    {loading ? (
                        <>
                            <span style={{
                                width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: 'white', borderRadius: '50%',
                                animation: 'spin 0.6s linear infinite', display: 'inline-block'
                            }}></span>
                            {formState === 0 ? 'Signing in...' : 'Creating account...'}
                        </>
                    ) : (
                        formState === 0 ? 'Sign In →' : 'Create Account →'
                    )}
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {formState === 0 ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => switchTab(formState === 0 ? 1 : 0)}
                        style={{ color: 'var(--primary-hover)', cursor: 'pointer', fontWeight: '600' }}
                    >
                        {formState === 0 ? 'Sign up free' : 'Sign in'}
                    </span>
                </p>
            </div>

            {/* Success Snackbar */}
            {open && (
                <div style={styles.snackbar}>
                    ✅ {message}
                </div>
            )}

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}