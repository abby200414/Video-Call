import React, { useContext, useEffect, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import RestoreIcon from '@mui/icons-material/Restore';
import VideocamIcon from '@mui/icons-material/Videocam';
import HomeIcon from '@mui/icons-material/Home';
import { AuthContext } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    // Ctrl+H shortcut — navigate to /home (useful from other pages too)
    useEffect(() => {
        const handleKey = (e) => {
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                navigate('/home');
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [navigate]);

    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        await addToUserHistory(meetingCode.trim());
        navigate(`/${meetingCode.trim()}`);
    };

    let handleNewMeeting = async () => {
        const code = Math.random().toString(36).substring(2, 10);
        await addToUserHistory(code);
        navigate(`/${code}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleJoinVideoCall();
    };

    return (
        <>
            <div className="navBar">
                {/* Logo — clicking navigates home */}
                <div
                    className="navLogo"
                    onClick={() => navigate('/home')}
                    style={{ cursor: 'pointer' }}
                    title="Home (Ctrl+H)"
                >
                    <div
                        className="logoIcon"
                        style={{
                            width: 34, height: 34, borderRadius: 9,
                            background: 'linear-gradient(135deg,#5b21b6,#7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem',
                            boxShadow: '0 0 16px rgba(124,58,237,0.5)',
                        }}
                    >🎥</div>
                    <h2>ConnectNow</h2>
                </div>

                <div className="navActions">
                    <ThemeToggle />

                    {/* Visible Home button */}
                    <button
                        className="homeBtn"
                        title="Home (Ctrl+H)"
                        onClick={() => navigate('/home')}
                    >
                        <HomeIcon fontSize="small" />
                        Home
                    </button>

                    <button
                        className="iconBtn"
                        title="Meeting History"
                        onClick={() => navigate("/history")}
                        style={{ borderRadius: '8px', padding: '7px' }}
                    >
                        <RestoreIcon fontSize="small" />
                    </button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '-6px' }}>History</span>

                    <button className="logoutBtn" onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/auth");
                    }}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="meetHero">
                    <h1>Your Meetings</h1>
                    <p>Start an instant call or join one with a meeting code.</p>
                </div>

                <div className="meetCards">
                    {/* New Meeting Card */}
                    <div className="meetCard">
                        <div className="cardIcon">
                            <VideocamIcon />
                        </div>
                        <div>
                            <h3>New Meeting</h3>
                            <p>Start an instant meeting with a randomly generated room.</p>
                        </div>
                        <button className="newMeetBtn" onClick={handleNewMeeting}>
                            🚀 Start Instantly
                        </button>
                    </div>

                    {/* Join Meeting Card */}
                    <div className="meetCard">
                        <div className="cardIcon" style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843', border: '1px solid rgba(212,168,67,0.2)' }}>
                            🔗
                        </div>
                        <div>
                            <h3>Join a Meeting</h3>
                            <p>Enter a meeting code to join an existing call.</p>
                        </div>
                        <div className="meetInputRow">
                            <input
                                className="meetInput"
                                placeholder="Enter meeting code..."
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="joinBtn"
                                onClick={handleJoinVideoCall}
                                disabled={!meetingCode.trim()}
                            >
                                Join →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Keyboard shortcut hint */}
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
                    Tip: Press <kbd style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'monospace', color: 'var(--primary-hover)' }}>Ctrl+H</kbd> to return here from anywhere
                </p>
            </div>
        </>
    );
}

export default withAuth(HomeComponent);