import { useNavigate } from 'react-router-dom'
import BackGroundImage from '../common/BackGroundImage'
import { useState, useRef } from 'react'

const AuthenticatePage = () => {
	const navigate = useNavigate()
	const [otpCode, setOtpCode] = useState<string>("")

	const inputsRef = useRef<Array<HTMLInputElement>>([])
	const length = 6

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const inputs = inputsRef.current
    inputs[index].value = value

    if (value && index < length - 1) {
      inputs[index + 1]?.focus()
    }

    const code = inputs.map(input => input?.value).join('')
    if (code.length <= length) {
      setOtpCode(code)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
		else if (e.key == "Enter")
			handleAuthenticate()
  }

	const handleAuthenticate = () => {
		if (!otpCode.trim() || otpCode.length != length)
			return

		authenticate(otpCode, navigate)
	}

	return (
		<>
			<BackGroundImage backgroundImageUrl='src/assets/background/background_main.png'>
				<div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
					{Array.from({ length }).map((_, i) => (
						<input
							key={i}
							type="text"
							inputMode="numeric"
							maxLength={1}
							ref={(el: HTMLInputElement) => { inputsRef.current[i] = el }}
							onChange={e => handleChange(i, e.target.value)}
							onKeyDown={e => handleKeyDown(e, i)}
							onInput={e => {
								const input = e.currentTarget
								input.value = input.value.replace(/[^0-9]/g, '')
							}}
							style={{
								width: '2.5rem',
								height: '2.5rem',
								fontSize: '1.5rem',
								textAlign: 'center',
								border: '1px solid #ccc',
								borderRadius: '0.5rem',
							}}
						/>
					))}
				</div>
				<button 
					onClick={handleAuthenticate}
					className="px-4 py-2 text-white bg-green-500 hover:bg-green-700 transition mt-4 rounded"
				>
					인증하기
				</button>
			</BackGroundImage>
		</>
	)
}

const authenticate = (otpCode: string, navigate: ReturnType<typeof useNavigate>) => {
	const userId = localStorage.getItem("userId")
	if (!userId) {
		alert("로그인이 필요합니다.")
		navigate("/")
		return
	}

	fetch(`${import.meta.env.VITE_API_BASE}/ft/api/auth/2fa/authenticate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userId, token: otpCode }),
	})
	.then((res) => {
		if (!res.ok) throw new Error("HTTP 오류")
		return res.json()
	})
	.then((data) => {
		if (data.success)
		{
			localStorage.setItem("accessToken", data.accessToken)
			localStorage.setItem("refreshToken", data.refreshToken)
			navigate("/lobby")
		}
		else throw new Error()
	})
	.catch(() => {
		alert("OTP 인증 오류")
		navigate("/")
	})
}

export default AuthenticatePage