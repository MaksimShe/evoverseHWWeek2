import './AccountLogin.css';
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {NavLink} from "react-router-dom";

export const AccountLogin = () => {
  const { user, loading, login, register, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRegister, setIsRegister] = useState(false); // <-- новий стан

  const handleAuth = async () => {
    if (loadingBtn) return;
    setLoadingBtn(true);
    setErrorMsg("");

    try {
      if (isRegister) {
        await register(email, password, username);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoadingBtn(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(prev => !prev);
    setErrorMsg("");
  };

  const handleSignOut = () => {
    logout();
  };

  if (loading) {
    return (
      <main className="login-bg">
        <p className="login-loader">Loading...</p>
      </main>
    )
  }

  if (user)
    return (
      <main className="login-bg">
        <div className="account-logined">
          <h2 className="login-title">Welcome, {user.username || user.email}</h2>
          <button onClick={handleSignOut} className='logined-btn'>Log Out</button>
          <NavLink to={"/"} className='logined-btn'>Go main menu</NavLink>
        </div>
      </main>
    );

  return (
    <main className="login-bg">
      <div className="login-page">
        <h2 className="login-title">{isRegister ? "Register" : "Login"}</h2>
        <div className="login-input-container">
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value.trim())}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {isRegister && (
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value.trim())}
            />
          )}
        </div>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <div className="login-btn-container">
          <button onClick={handleAuth} disabled={loadingBtn} className='login-btn'>
            {isRegister ? "Sign Up" : "Sign In"}
          </button>

          <button onClick={toggleMode} className="login-toggle-btn">
            {isRegister ? "Already have an account? Sign In" : "No account? Register"}
          </button>
        </div>
      </div>
    </main>
  );
}
