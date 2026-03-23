import React, { useEffect, useRef, useState, useCallback } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, Tooltip } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import server from '../environment';
import { useNavigate } from 'react-router-dom';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

// Computes CSS grid columns based on participant count (matrix layout)
function getGridColumns(count) {
    if (count <= 1) return 1;
    if (count <= 2) return 2;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    if (count <= 9) return 3;
    return 4;
}

export default function VideoMeetComponent() {
    const navigate = useNavigate();

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();
    const messagesEndRef = useRef(null);

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);
    let [focusedId, setFocusedId] = useState(null);
    let [participantNames, setParticipantNames] = useState({}); // socketId -> name

    // ── Draggable PiP (self-view) ────────────────────────────────────
    const [pipPos, setPipPos] = useState(null); // null = CSS default, {x,y} = fixed after drag
    const pipDragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

    const onPipMouseDown = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        pipDragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: rect.left, origY: rect.top };
        const pipW = rect.width, pipH = rect.height;
        const onMove = (ev) => {
            if (!pipDragRef.current.dragging) return;
            const newX = pipDragRef.current.origX + ev.clientX - pipDragRef.current.startX;
            const newY = pipDragRef.current.origY + ev.clientY - pipDragRef.current.startY;
            setPipPos({
                x: Math.max(0, Math.min(window.innerWidth  - pipW, newX)),
                y: Math.max(0, Math.min(window.innerHeight - pipH, newY)),
            });
        };
        const onUp = () => {
            pipDragRef.current.dragging = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    // ── Ctrl+H shortcut ──────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                navigate('/home');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    // ── Auto-scroll chat to bottom ────────────────────────────────────
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        getPermissions();
    }, []);

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .catch((e) => console.log(e));
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoAvailable(!!videoPermission);

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioAvailable(!!audioPermission);

            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]);

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try { window.localStream.getTracks().forEach(track => track.stop()) } catch (e) { }
        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    }).catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;

            for (let id in connections) {
                connections[id].addStream(window.localStream);
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                        }).catch(e => console.log(e));
                });
            }
        });
    }

    // Fixed camera/audio toggle — enable/disable existing tracks instead of
    // stopping + restarting (avoids permission re-request and black-frame bugs)
    let handleVideo = () => {
        const newVal = !video;
        setVideo(newVal);
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(t => { t.enabled = newVal; });
        }
    };
    let handleAudio = () => {
        const newVal = !audio;
        setAudio(newVal);
        if (window.localStream) {
            window.localStream.getAudioTracks().forEach(t => { t.enabled = newVal; });
        }
    };

    // Internal: restart camera/mic after screen share ends
    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e));
        }
    }

    let getDislayMediaSuccess = (stream) => {
        try { window.localStream.getTracks().forEach(track => track.stop()) } catch (e) { }
        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    }).catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { }
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;
            getUserMedia();
        });
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);
        if (fromId !== socketIdRef.current) {
            // Handle name announcement piggy-backed in the signal channel
            if (signal.participantName) {
                setParticipantNames(prev => ({ ...prev, [fromId]: signal.participantName }));
                return;
            }
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;
            socketRef.current.on('chat-message', addMessage);

            // Announce our name to everyone already in the room
            socketRef.current.emit('participant-name', socketRef.current.id, username);

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
                setFocusedId((prev) => prev === id ? null : prev);
                setParticipantNames(prev => { const n = { ...prev }; delete n[id]; return n; });
            });

            // Receive another participant's name
            socketRef.current.on('participant-name', (fromId, name) => {
                setParticipantNames(prev => ({ ...prev, [fromId]: name }));
                // Reply with our own name so they know ours too
                socketRef.current.emit('signal', fromId, JSON.stringify({ participantName: username }));
            });

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    }
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);
                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;
                        try { connections[id2].addStream(window.localStream) } catch (e) { }
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                }).catch(e => console.log(e));
                        });
                    }
                }
            });
        });
    }

    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    }



    useEffect(() => {
        if (screen !== undefined) getDislayMedia();
    }, [screen])

    // Auto-spotlight local video when screen sharing starts (so others see it full-size)
    useEffect(() => {
        if (screen) {
            setFocusedId('local');
        } else {
            setFocusedId(prev => (prev === 'local' ? null : prev));
        }
    }, [screen]);

    let handleScreen = () => setScreen(!screen);

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        } catch (e) { }
        navigate('/home');
    }

    let openChat = () => { setModal(true); setNewMessages(0); }
    let closeChat = () => setModal(false);
    let handleMessage = (e) => setMessage(e.target.value);

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender, data, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prev) => prev + 1);
        }
    };

    let sendMessage = () => {
        if (!message.trim()) return;
        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    // Toggle expand/focus on a video card
    const toggleFocus = (socketId) => {
        setFocusedId((prev) => (prev === socketId ? null : socketId));
    };

    // ──────────────────────────────────────────────────────────────────
    //  LOBBY SCREEN
    // ──────────────────────────────────────────────────────────────────
    if (askForUsername) {
        return (
            <div style={lobbyStyles.page}>
                <div style={lobbyStyles.card}>
                    <div style={lobbyStyles.logoRow}>
                        <span style={lobbyStyles.logoIcon}>🎥</span>
                        <span style={lobbyStyles.logoText}>ConnectNow</span>
                    </div>
                    <h1 style={lobbyStyles.title}>Join the Meeting</h1>
                    <p style={lobbyStyles.subtitle}>Enter your display name to continue</p>

                    <div style={lobbyStyles.videoPreview}>
                        <video ref={localVideoref} autoPlay muted style={lobbyStyles.video}></video>
                        <div style={lobbyStyles.videoOverlay}>Preview</div>
                    </div>

                    <div style={lobbyStyles.inputRow}>
                        <input
                            style={lobbyStyles.input}
                            placeholder="Your display name..."
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && username.trim() && connect()}
                            onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.25)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(124,58,237,0.2)'; e.target.style.boxShadow = 'none'; }}
                        />
                        <button
                            style={{ ...lobbyStyles.connectBtn, opacity: username.trim() ? 1 : 0.5, cursor: username.trim() ? 'pointer' : 'not-allowed' }}
                            onClick={connect}
                            disabled={!username.trim()}
                        >
                            Join →
                        </button>
                    </div>
                    <p style={lobbyStyles.hint}>Tip: Press <kbd style={lobbyStyles.kbd}>Ctrl+H</kbd> anytime to return home</p>
                </div>

                <style>{`
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes subtlePulse { 0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); } 50% { box-shadow: 0 0 0 14px rgba(124,58,237,0); } }
                `}</style>
            </div>
        );
    }

    // ──────────────────────────────────────────────────────────────────
    //  CALL SCREEN
    // ── CALL SCREEN ──────────────────────────────────────────────────
    // Grid is based on REMOTE participants only (local is a floating PiP)
    const cols = getGridColumns(videos.length);

    return (
        <div className={styles.meetVideoContainer}>

            {/* ── TOP BAR ── */}
            <div className={styles.topBar}>
                <div className={styles.topBarLogo}>
                    <span className={styles.topBarLogoIcon}>🎥</span>
                    <span className={styles.topBarLogoText}>ConnectNow</span>
                </div>
                <div className={styles.topBarRight}>
                    <Tooltip title="Go Home (Ctrl+H)" placement="bottom">
                        <button className={styles.topBarHomeBtn} onClick={() => navigate('/home')}>
                            <HomeIcon fontSize="small" />
                            <span>Home</span>
                        </button>
                    </Tooltip>
                    <div className={styles.participantPill}>
                        {videos.length + 1} participant{videos.length !== 0 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* ── MAIN AREA ── */}
            <div className={styles.mainArea}>

                {/* ── CONFERENCE VIEW ── */}
                {focusedId ? (
                    /* ── SPOTLIGHT MODE ── */
                    <div className={styles.spotlightLayout}>
                        <div className={styles.spotlightMain}>
                            {focusedId === 'local' ? (
                                <video className={styles.spotlightVideo} ref={localVideoref} autoPlay muted />
                            ) : (
                                <video
                                    className={styles.spotlightVideo}
                                    ref={ref => {
                                        const v = videos.find(x => x.socketId === focusedId);
                                        if (ref && v?.stream) ref.srcObject = v.stream;
                                    }}
                                    autoPlay
                                />
                            )}
                            <div className={styles.spotlightOverlay}>
                                <span className={styles.spotlightName}>
                                    {focusedId === 'local'
                                        ? `${username || 'You'}${screen ? ' · Sharing Screen' : ' (You)'}`
                                        : (participantNames[focusedId] || `Participant ${videos.findIndex(v => v.socketId === focusedId) + 1}`)}
                                </span>
                                <button className={styles.exitSpotlightBtn} onClick={() => setFocusedId(null)}>
                                    ⊠ Exit Spotlight
                                </button>
                            </div>
                        </div>
                    {/* No thumbnail strip — focused participant fills the entire canvas */}
                    </div>

                ) : (
                    /* ── GALLERY GRID MODE — remote participants fill the grid ── */
                    <div className={styles.conferenceView} style={{ '--grid-cols': videos.length === 0 ? 1 : cols }}>
                        {videos.length === 0 ? (
                            /* Waiting state — no remote participants yet */
                            <div className={styles.waitingState}>
                                <span className={styles.waitingIcon}>🎥</span>
                                <p className={styles.waitingText}>Waiting for others to join…</p>
                            </div>
                        ) : (
                            videos.map((v, idx) => (
                                <div key={v.socketId} className={styles.videoCard} onClick={() => toggleFocus(v.socketId)}>
                                    <video
                                        className={styles.videoEl}
                                        ref={ref => { if (ref && v.stream) ref.srcObject = v.stream; }}
                                        autoPlay
                                    />
                                    <div className={styles.videoOverlay}>
                                        <span className={styles.participantName}>
                                            {participantNames[v.socketId] || `Participant ${idx + 1}`}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ── FLOATING SELF-VIEW (PiP) —
                     Default: bottom-right (or bottom-left when chat is open)
                     After drag: fixed anywhere on screen ── */}
                <div
                    className={styles.selfView}
                    style={
                        pipPos
                            ? { position: 'fixed', left: pipPos.x, top: pipPos.y, right: 'auto', bottom: 'auto', cursor: pipDragRef.current.dragging ? 'grabbing' : 'grab' }
                            : (showModal ? { right: 'auto', left: '16px' } : { cursor: 'grab' })
                    }
                    onMouseDown={onPipMouseDown}
                >
                    <video className={styles.selfViewVideo} ref={localVideoref} autoPlay muted />
                    {!video && <div className={styles.selfViewCamOff}>📷 Off</div>}
                    <div className={styles.selfViewName}>{username || 'You'}</div>
                </div>

                {/* ── CHAT PANEL ── */}
                {showModal && (
                    <div className={styles.chatRoom}>
                        <div className={styles.chatContainer}>
                            <div className={styles.chatHeader}>
                                <h2>💬 Room Chat</h2>
                                <button className={styles.chatCloseBtn} onClick={closeChat}>
                                    <CloseIcon fontSize="small" />
                                </button>
                            </div>

                            <div className={styles.chattingDisplay}>
                                {messages.length === 0 ? (
                                    <div className={styles.emptyChat}>
                                        <span style={{ fontSize: '2.2rem' }}>💬</span>
                                        <span>No messages yet</span>
                                        <span style={{ fontSize: '0.75rem' }}>Be the first to say hi!</span>
                                    </div>
                                ) : messages.map((item, index) => {
                                    const isOwn = item.sender === username;
                                    return (
                                        <div
                                            key={index}
                                            className={`${styles.chatBubbleWrapper} ${isOwn ? styles.chatBubbleWrapperOwn : ''}`}
                                        >
                                            {!isOwn && (
                                                <span className={styles.chatSenderName}>{item.sender}</span>
                                            )}
                                            <div className={`${styles.chatBubble} ${isOwn ? styles.chatBubbleOwn : styles.chatBubbleOther}`}>
                                                <span className={styles.chatText}>{item.data}</span>
                                                <span className={styles.chatTime}>{item.time}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className={styles.chattingArea}>
                                <input
                                    className={styles.chatInput}
                                    value={message}
                                    onChange={handleMessage}
                                    placeholder="Type a message..."
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button className={styles.sendBtn} onClick={sendMessage} disabled={!message.trim()}>
                                    <SendIcon fontSize="small" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── CONTROL BAR ── */}
            <div className={styles.buttonContainers}>
                <Tooltip title={video ? "Turn off camera" : "Turn on camera"} placement="top">
                    <button
                        className={`${styles.ctrlBtn} ${!video ? styles.ctrlBtnOff : ''}`}
                        onClick={handleVideo}
                    >
                        {video ? <VideocamIcon fontSize="small" /> : <VideocamOffIcon fontSize="small" />}
                    </button>
                </Tooltip>

                <Tooltip title={audio ? "Mute" : "Unmute"} placement="top">
                    <button
                        className={`${styles.ctrlBtn} ${!audio ? styles.ctrlBtnOff : ''}`}
                        onClick={handleAudio}
                    >
                        {audio ? <MicIcon fontSize="small" /> : <MicOffIcon fontSize="small" />}
                    </button>
                </Tooltip>

                {screenAvailable && (
                    <Tooltip title={screen ? "Stop sharing" : "Share screen"} placement="top">
                        <button
                            className={`${styles.ctrlBtn} ${screen ? styles.ctrlBtnActive : ''}`}
                            onClick={handleScreen}
                        >
                            {screen ? <ScreenShareIcon fontSize="small" /> : <StopScreenShareIcon fontSize="small" />}
                        </button>
                    </Tooltip>
                )}

                <Tooltip title="Chat" placement="top">
                    <button
                        className={`${styles.ctrlBtn} ${showModal ? styles.ctrlBtnActive : ''}`}
                        onClick={() => { setModal(!showModal); if (!showModal) setNewMessages(0); }}
                        style={{ position: 'relative' }}
                    >
                        <ChatIcon fontSize="small" />
                        {newMessages > 0 && (
                            <span className={styles.chatBadge}>{newMessages > 9 ? '9+' : newMessages}</span>
                        )}
                    </button>
                </Tooltip>

                <Tooltip title="End call" placement="top">
                    <button className={`${styles.ctrlBtn} ${styles.ctrlBtnDanger}`} onClick={handleEndCall}>
                        <CallEndIcon fontSize="small" />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}

// ── LOBBY INLINE STYLES ────────────────────────────────────────────────
const lobbyStyles = {
    page: {
        minHeight: '100vh',
        background: '#07071a',
        backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(212,168,67,0.08) 0%, transparent 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
    },
    card: {
        background: 'rgba(13,13,36,0.95)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.15)',
        animation: 'fadeIn 0.45s ease',
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    logoIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        background: 'linear-gradient(135deg,#5b21b6,#7c3aed)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        boxShadow: '0 0 20px rgba(124,58,237,0.5)',
    },
    logoText: {
        fontSize: '1.15rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #7c3aed, #a855f7, #d4a843)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.02em',
    },
    title: {
        fontSize: '1.7rem',
        fontWeight: '900',
        color: '#f0eeff',
        letterSpacing: '-0.03em',
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#9d8ec4',
        marginTop: '-0.5rem',
    },
    videoPreview: {
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        background: '#0a0a1e',
        border: '1px solid rgba(124,58,237,0.3)',
        aspectRatio: '16/9',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    videoOverlay: {
        position: 'absolute',
        bottom: '8px',
        right: '10px',
        background: 'rgba(124,58,237,0.6)',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '0.7rem',
        fontWeight: '600',
        padding: '2px 10px',
        borderRadius: '100px',
        letterSpacing: '0.05em',
    },
    inputRow: {
        display: 'flex',
        gap: '0.6rem',
    },
    input: {
        flex: 1,
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        background: 'rgba(124,58,237,0.06)',
        border: '1px solid rgba(124,58,237,0.2)',
        color: '#f0eeff',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.92rem',
        outline: 'none',
        transition: 'all 0.2s ease',
    },
    connectBtn: {
        padding: '0.75rem 1.3rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg,#5b21b6,#7c3aed)',
        border: 'none',
        color: 'white',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '700',
        fontSize: '0.92rem',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
        whiteSpace: 'nowrap',
    },
    hint: {
        fontSize: '0.78rem',
        color: 'rgba(157,142,196,0.7)',
        textAlign: 'center',
    },
    kbd: {
        display: 'inline-block',
        background: 'rgba(124,58,237,0.15)',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: '4px',
        padding: '0 5px',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        color: '#a855f7',
    },
};