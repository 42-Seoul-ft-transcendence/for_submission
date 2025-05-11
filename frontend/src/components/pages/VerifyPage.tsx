import { useNavigate } from 'react-router-dom';
import BackGroundImage from '../common/BackGroundImage';
import { useState, useRef } from 'react';
import BasicButton from '../common/BasicButton';
import fetchWithAuth from '../utils/fetchWithAuth'

const VerifyPage = () => {
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState<string>('');

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const length = 6;

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const inputs = inputsRef.current;
    inputs[index]!.value = value;

    if (value && index < length - 1) {
      inputs[index + 1]?.focus();
    }

    const code = inputs.map((input) => input?.value).join('')
    if (code.length <= length) {
      setOtpCode(code);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key == 'Enter') handleVerify();
  };

  const handleVerify = () => {
    if (!otpCode.trim() || otpCode.length != length) return;

    verifyOTP(otpCode, navigate);
  };

  return (
    <>
      <BackGroundImage backgroundImageUrl="/assets/background/background_main.png">
        <div className="flex justify-center gap-5 mb-4">
          {Array.from({ length }).map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onInput={(e) => {
                const input = e.currentTarget;
                input.value = input.value.replace(/[^0-9]/g, '');
              }}
              className="w-16 h-20 text-5xl text-center border-2 border-black rounded-sm focus:outline-none focus:border-blue-500"
            />
          ))}
        </div>
        <BasicButton onClick={handleVerify} className="mt-24">
          VERIFY
        </BasicButton>
      </BackGroundImage>
    </>
  );
};

const verifyOTP = (otpCode: string, navigate: ReturnType<typeof useNavigate>) => {
  const secret = localStorage.getItem('secret');
  if (!secret) {
    alert('비정상적인 접근입니다.');
    navigate('/lobby');
  }

  fetchWithAuth(`${import.meta.env.VITE_API_BASE}/ft/api/auth/2fa/verify`, navigate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: otpCode, secret }),
  })
  .then((res) => {
    localStorage.removeItem('secret');
    if (!res.ok) throw new Error('HTTP 오류');
      alert('2FA 등록 완료');
  })
  .catch(() => {
    alert('OTP 인증 오류');
  });
  navigate('/lobby');
};

export default VerifyPage;
