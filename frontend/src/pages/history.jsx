import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history || []);
            } catch {
                setMeetings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleRejoin = (code) => {
        routeTo(`/${code}`);
    };

    return (
        <div style={styles.page}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navLogo}>
                    <div style={styles.logoIcon}>🎥</div>
                    <span style={styles.logoText}>ConnectNow</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ThemeToggle />
                    <button style={styles.backBtn} onClick={() => routeTo('/home')}>
                        ← Back to Home
                    </button>
                </div>
            </nav>

            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Meeting History</h1>
                    <p style={styles.subtitle}>Your recent video calls</p>
                </div>

                {loading ? (
                    <div style={styles.centerBox}>
                        <div style={styles.spinner}></div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading history...</p>
                    </div>
                ) : meetings.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📭</div>
                        <h3 style={styles.emptyTitle}>No meetings yet</h3>
                        <p style={styles.emptyDesc}>Start or join a meeting and it will appear here.</p>
                        <button style={styles.emptyBtn} onClick={() => routeTo('/home')}>
                            Start a Meeting
                        </button>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {meetings.map((e, i) => (
                            <div key={i} style={styles.card}>
                                <div style={styles.cardLeft}>
                                    <div style={styles.codeChip}>{e.meetingCode}</div>
                                    <div style={styles.dateText}>
                                        📅 {formatDate(e.date)}
                                    </div>
                                </div>
                                <button
                                    style={styles.rejoinBtn}
                                    onClick={() => handleRejoin(e.meetingCode)}
                                    onMouseEnter={(el) => {
                                        el.target.style.background = 'linear-gradient(135deg,#6366f1,#818cf8)';
                                        el.target.style.borderColor = 'transparent';
                                    }}
                                    onMouseLeave={(el) => {
                                        el.target.style.background = 'transparent';
                                        el.target.style.borderColor = 'rgba(99,102,241,0.4)';
                                    }}
                                >
                                    Rejoin →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        fontFamily: "'Inter', sans-serif",
    },
    navbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2.5rem',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    navLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    logoIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'linear-gradient(135deg,#6366f1,#818cf8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
    },
    logoText: {
        fontSize: '1.2rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #38bdf8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    backBtn: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--text-secondary)',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    content: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '3rem 2rem',
    },
    header: {
        marginBottom: '2.5rem',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: '800',
        letterSpacing: '-0.03em',
        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.4rem',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
    },
    centerBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 0',
    },
    spinner: {
        width: 36,
        height: 36,
        border: '3px solid rgba(99,102,241,0.2)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5rem 0',
        gap: '0.75rem',
    },
    emptyIcon: {
        fontSize: '3.5rem',
        marginBottom: '0.5rem',
    },
    emptyTitle: {
        fontSize: '1.3rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    emptyDesc: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        marginBottom: '1rem',
    },
    emptyBtn: {
        padding: '0.7rem 1.5rem',
        border: 'none',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1, #818cf8)',
        color: 'white',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '600',
        fontSize: '0.95rem',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '1.2rem 1.5rem',
        transition: 'all 0.2s ease',
    },
    cardLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    codeChip: {
        display: 'inline-block',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: '6px',
        padding: '0.25rem 0.7rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        color: 'var(--primary-hover)',
        letterSpacing: '0.03em',
        fontFamily: "'Courier New', monospace",
    },
    dateText: {
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
    },
    rejoinBtn: {
        padding: '0.5rem 1.1rem',
        borderRadius: '8px',
        border: '1px solid rgba(99,102,241,0.4)',
        background: 'transparent',
        color: 'var(--primary-hover)',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.88rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};