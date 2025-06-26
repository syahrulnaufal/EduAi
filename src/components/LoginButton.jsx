import React from "react";

function LoginButton({ onLogin, onSubscribe }) {
    return (
        <div className="flex items-center gap-2 box-border">
        <button
            onClick={onSubscribe}
            className="bg-my-blue text-base text-white 
            hover:bg-blue-700 px-4 py-2 rounded-4xl transition duration-200"
        >
            Langganan
        </button>
        <button
            onClick={onLogin}
            className="bg-my-bg text-base text-my-text 
            hover:bg-my-blue/10 px-4 py-2 rounded-4xl border border-my-border transition duration-200"
        >
            Masuk/Daftar
        </button>
        </div>
    );
}

export default LoginButton;