import { GoogleOAuthProvider, TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackGroundImage from '../common/BackGroundImage'
import Logo from '/assets/logo.svg';
import LoginButton from '/assets/button/login_button.svg'
import IsLoggedIn from '../utils/IsLoggedIn';

const LoginPage = () => {
	const navigate = useNavigate()
	useEffect(() => {
		if (IsLoggedIn())
			navigate("/lobby", {replace: true})
	},[navigate])

	return (
		<>
			<BackGroundImage backgroundImageUrl='/assets/background/background_main.png'>
				<div className="flex flex-col items-center justify-between h-full gap-[5vh]">
					<img 
					src={Logo}
					className="w-[50vw] max-w-[1000px] h-auto object-contain mt-[25vh]"
					alt="logo" />
					<GoogleOAuthProvider
						clientId={import.meta.env.VITE_CLIENT_ID}>
							<Login />
					</GoogleOAuthProvider>
				</div>
			</BackGroundImage>
		</>
	)
}

const Login = () => {
	const navigate = useNavigate()

	const handleSuccess = (response: TokenResponse) => {
		if (!response) {
			alert("구글 로그인 오류.")
			navigate("/")
		}
		fetch(`${import.meta.env.VITE_API_BASE}/ft/api/auth/login/google`, {
			method: "POST",
			headers: { "content-Type": "application/json" },
			body: JSON.stringify({ googleAccessToken: response.access_token }),
		})
		.then((res) => {
			if (!res.ok) throw new Error()
			return res.json()})
		.then((data) => {
			localStorage.setItem("userId", data.userId)
			if (data.requireTFA) {
				navigate("/authenticate")
			}
			else {
				localStorage.setItem("accessToken", data.accessToken)
				localStorage.setItem("refreshToken", data.refreshToken)
				navigate("/lobby")
			}
		})
		.catch((err) => {
			console.error("login error:", err)
			alert("로그인 오류")
			navigate("/")
		})
	}

	const login = useGoogleLogin({
		onSuccess: handleSuccess,
		scope: "openid email profile",
	})

	return (
			<button 
				onClick={() => login()}
				className="w-[30vw] max-w-[1000px] h-auto mb-[35vh]"
			>
      	<img src={LoginButton} alt="Google 로그인" className="w-full h-full object-contain" />
    	</button>
	)
}

export default LoginPage