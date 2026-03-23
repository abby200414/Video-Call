import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            className={`themeToggle ${isDark ? 'dark' : 'light'}`}
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
        >
            <span className="toggleTrack">
                <span className="toggleThumb"></span>
            </span>
            {isDark ? '🌙' : '☀️'}
        </button>
    );
}
