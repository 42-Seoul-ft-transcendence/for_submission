import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackGroundImage from '../common/BackGroundImage';
import BasicButton from '../common/BasicButton';
import fetchWithAuth from '../utils/fetchWithAuth';

const RegisterPage = () => {
  return (
    <>
      <BackGroundImage backgroundImageUrl="/assets/background/background_2fa.png">
        <OTPRegister />
      </BackGroundImage>
    </>
  );
};

const OTPRegister = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
     fetchWithAuth(`${import.meta.env.VITE_API_BASE}/ft/api/auth/2fa/setup`, navigate, {
       method: "GET",
     })
     .then((res) => res.json())
     .then((data) => {
       localStorage.setItem("secret", data.secret)
       setQrCodeUrl(data.qrCodeUrl)
     })
     .catch((err) => {
     	console.error("OTP 등록 오류:", err)
     	alert("OTP 등록 오류")
     	navigate("/")
     });
  }, []);

  const handleComplete = () => {
    navigate('/verify');
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-white/70 w-[1200px] h-[660px] flex flex-col text-center justify-center items-center">
        <h2 className="text-[#009F00] text-5xl mb-20 mt-10">
          Scan this QR code <br /> with the Microsoft Authenticator app
        </h2>
        {qrCodeUrl ? (
          <img src={qrCodeUrl} width="200" height="200" className="mb-10" />
        ) : (
          <p>QR 코드 로딩 중...</p>
        )}
        <BasicButton onClick={handleComplete}>Enter Code</BasicButton>
      </div>
    </div>
  );
};

export default RegisterPage;
