import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import './index.css'

const Login = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [showError, setShowError] = useState(false)

    const submitForm = async e => {
        e.preventDefault()

        const userDetails = {
            username,
            password,
        }

        const url = 'https://apis.ccbp.in/login'

        const options = {
            method: 'POST',
            body: JSON.stringify(userDetails),
        }

        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok) {
            localStorage.setItem('jwt_token', data.jwt_token)
            navigate('/')
        } else {
            setShowError(true)
            setErrorMsg(data.error_msg)
        }
    }

    const jwtToken = localStorage.getItem('jwt_token')

    if (jwtToken) {
        return <Navigate to="/" />
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={submitForm}>
                <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
                    alt="website login"
                    className="login-image"
                />

                <h1 className="login-title">Book Hub</h1>

                <label htmlFor="username">USERNAME</label>

                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

                <label htmlFor="password">PASSWORD</label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button type="submit" className="login-btn">
                    Login
                </button>

                {showError && <p className="error-msg">*{errorMsg}</p>}
            </form>
        </div>
    )
}

export default Login