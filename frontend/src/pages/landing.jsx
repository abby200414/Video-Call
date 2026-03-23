import "../App.css"
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navLogo'>
                    <div className='logoIcon'>🎥</div>
                    <h2>ConnectNow</h2>
                </div>
                <div className='navlist'>
                    <ThemeToggle />
                    <button className='navLink' onClick={() => router("/aljk23")}>Join as Guest</button>
                    <button className='navLink' onClick={() => router("/auth")}>Register</button>
                    <button className='navBtn' onClick={() => router("/auth")}>Login</button>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div className="heroText">
                    <div className="eyebrow">
                        <span>✨</span> HD Video Calls for Everyone
                    </div>
                    <h1>
                        <span className="gradient-text">Connect</span> with<br />
                        anyone, anywhere
                    </h1>
                    <p>
                        Crystal-clear video calls, real-time chat, and seamless screen sharing —
                        all in one place. No downloads required.
                    </p>
                    <div className="heroCta">
                        <button className="btnPrimary" onClick={() => router("/auth")}>
                            Get Started Free →
                        </button>
                        <button className="btnSecondary" onClick={() => router("/aljk23")}>
                            Join as Guest
                        </button>
                    </div>
                </div>

                <div className="heroVisual">
                    <img src="./mobile.png" alt="ConnectNow video call preview" />
                </div>
            </div>

            <div className="featuresSection">
                <div className="featureCard">
                    <div className="featureIcon">🔒</div>
                    <h3>End-to-End Encrypted</h3>
                    <p>Your conversations stay private. All video and audio is encrypted so only participants can see and hear.</p>
                </div>
                <div className="featureCard">
                    <div className="featureIcon">⚡</div>
                    <h3>Ultra-Low Latency</h3>
                    <p>Powered by WebRTC for real-time peer-to-peer communication with minimal delay and maximum quality.</p>
                </div>
                <div className="featureCard">
                    <div className="featureIcon">💬</div>
                    <h3>Built-in Chat</h3>
                    <p>Exchange messages, share links, and collaborate without leaving the call. Works alongside your video.</p>
                </div>
            </div>
        </div>
    )
}