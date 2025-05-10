import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingIcon from '../../assets/icon/setting.svg';
import BasicButton from '../common/BasicButton';
import fetchWithAuth from '../utils/fetchWithAuth';

type EditProfileContentProps = {
  onSaveSuccess: () => void;
  initial2FAEnabled: boolean;
};

function EditProfileContent({ onSaveSuccess, initial2FAEnabled }: EditProfileContentProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // ✅ 추가
  const [is2FAEnabled, setIs2FAEnabled] = useState(initial2FAEnabled);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file); // ✅ 파일 저장

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handle2FAToggle = async () => {
    if (!is2FAEnabled) {
      // ✅ 2FA 비활성화: API 호출
      try {
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_API_BASE}/ft/api/auth/2fa`,
          navigate,
          { method: 'DELETE' },
        );

        if (!res.ok) throw new Error('2FA 비활성화 실패');

        alert('2FA has been disabled.');
        setIs2FAEnabled(false); // 상태 갱신
      } catch (err) {
        console.error('❌ 2FA 비활성화 실패:', err);
        alert('Failed to disable 2FA');
      }
    } else {
      navigate('/register');
    }
  };

  const handleSave = async () => {
    try {
      // 닉네임 변경
      const resName = await fetch(`${import.meta.env.VITE_API_BASE}/ft/api/users/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ name: nickname }),
      });

      if (!resName.ok) throw new Error('닉네임 변경 실패');

      // 이미지 업로드
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile); // File 객체 그대로 전달

        const resImage = await fetch(`${import.meta.env.VITE_API_BASE}/ft/api/users/me/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            // Content-Type은 절대 설정하지 말 것! (자동으로 multipart/form-data + boundary가 붙음)
          },
          body: formData,
        });

        if (!resImage.ok) throw new Error('이미지 업로드 실패');
      }

      alert('Profile successfully updated!');
      onSaveSuccess();
    } catch (error) {
      console.error('❌ 저장 실패:', error);
      alert('Failed to save changes');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 gap-5">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-12">
        <img src={SettingIcon} alt="setting" className="w-8 h-8" />
        <h1 className="text-white text-6xl font-bold">setting</h1>
        <img src={SettingIcon} alt="setting" className="w-8 h-8" />
      </div>

      {/* Nickname */}
      <div className="flex items-center justify-between w-full max-w-md mb-12">
        <label className="text-white text-3xl font-bold">nickname</label>
        <input
          type="text"
          className="w-60 h-10 p-2 text-xl rounded-md"
          placeholder="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      {/* Profile Upload */}
      <div className="flex flex-row items-center justify-between w-full max-w-md mb-12">
        <label className="text-white text-3xl font-bold mb-2">profile</label>
        <div className="flex flex-col gap-1">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover border border-dashed border-white mb-4"
            />
          )}
          <label
            htmlFor="profile-upload"
            className="cursor-pointer text-center flex items-center justify-center h-8 px-4 py-2 bg-[#858787] text-white rounded-md text-lg"
          >
            ⇧ Upload Image ⇧
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* 2FA */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <label className="text-white text-3xl font-bold">2FA</label>
        <button
          onClick={handle2FAToggle}
          className={`px-6 py-2 text-xl h-10 flex items-center rounded-md font-bold border-4 ${
            is2FAEnabled
              ? 'bg-white text-[#858787] border-[#858787]'
              : 'bg-white text-green-500 border-green-500'
          }`}
        >
          {is2FAEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      {/* Save */}
      <BasicButton className="absolute bottom-12 w-[300px] h-[60px]" onClick={handleSave}>
        Save
      </BasicButton>
    </div>
  );
}

export default EditProfileContent;
