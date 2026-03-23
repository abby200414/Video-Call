import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import RestoreIcon from '@mui/icons-material/Restore';
import VideocamIcon from '@mui/icons-material/Videocam';
import { IconButton } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

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
                <div className="navLogo">
                    <div className="logoIcon" style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#818cf8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '1rem' }}>🎥</div>
                    <h2>ConnectNow</h2>
                </div>
                <div className="navActions">
                    <ThemeToggle />
                    <IconButton
                        className="iconBtn"
                        title="Meeting History"
                        onClick={() => navigate("/history")}
                        sx={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px' }}
                    >
                        <RestoreIcon fontSize="small" />
                    </IconButton>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '-4px' }}>History</span>

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
                        <div className="cardIcon" style={{ background: 'rgba(167,139,250,0.1)', color: 'var(--accent)' }}>
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
            </div>
        </>
    );
}

export default withAuth(HomeComponent);