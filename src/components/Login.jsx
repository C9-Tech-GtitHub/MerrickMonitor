import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

const Login = ({ onLogin }) => {
    const [passwordInput, setPasswordInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [date, setDate] = useState(new Date());

    // Blinking cursor & Time update
    useEffect(() => {
        const updateMelbourneTime = () => {
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: "Australia/Melbourne",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });

            const parts = formatter.formatToParts(new Date());
            const dateObj = {};
            parts.forEach(({ type, value }) => {
                dateObj[type] = value;
            });

            const melbourneDate = new Date(
                parseInt(dateObj.year),
                parseInt(dateObj.month) - 1,
                parseInt(dateObj.day),
                parseInt(dateObj.hour),
                parseInt(dateObj.minute),
                parseInt(dateObj.second),
            );
            setDate(melbourneDate);
        };

        updateMelbourneTime();
        const timer = setInterval(updateMelbourneTime, 1000);
        const cursorTimer = setInterval(() => setCursorVisible((v) => !v), 800);
        return () => {
            clearInterval(timer);
            clearInterval(cursorTimer);
        };
    }, []);

    const formatTime = (d) =>
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setShowError(false);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput,
                }),
            });

            if (response.ok) {
                onLogin();
            } else {
                setShowError(true);
                setPasswordInput("");
            }
        } catch (error) {
            console.error("Login error:", error);
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4 selection:bg-green-900 selection:text-green-100">
            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />

            <div className="max-w-md w-full border-2 border-green-900 p-8 bg-black shadow-[0_0_30px_rgba(34,197,94,0.1)] relative z-10">
                <div className="flex items-center justify-center mb-8">
                    <Lock className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-center mb-2 text-green-400 uppercase tracking-widest">
                    ACCESS REQUIRED
                </h1>
                <p className="text-xs text-green-700 text-center mb-8 tracking-wide">
                    MERRICK MONITOR // AUTHENTICATION PORTAL
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs text-green-600 mb-2 uppercase tracking-wider">
                            Username
                        </label>
                        <input
                            type="text"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="w-full bg-black border-2 border-green-800 text-green-400 px-4 py-3 focus:outline-none focus:border-green-500 transition-colors font-mono mb-4"
                            placeholder="USERNAME"
                            autoFocus
                        />
                        <label className="block text-xs text-green-600 mb-2 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-black border-2 border-green-800 text-green-400 px-4 py-3 focus:outline-none focus:border-green-500 transition-colors font-mono"
                            placeholder="••••••••"
                        />
                        {showError && (
                            <p className="text-xs text-red-500 mt-2 animate-pulse">
                                ACCESS DENIED - INVALID CREDENTIALS
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-900 hover:bg-green-800 text-green-100 font-bold py-3 px-4 border-2 border-green-700 hover:border-green-500 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "AUTHENTICATING..." : "→ AUTHENTICATE"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <div className="text-xs text-green-800">
                        {formatTime(date)}
                        <span
                            className={`ml-1 ${cursorVisible ? "opacity-100" : "opacity-0"} transition-opacity`}
                        >
                            _
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
