import React from 'react';

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string; // 추가 스타일도 받을 수 있게
};

function BasicButton({ onClick, children, className = '' }: Props) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#444242] text-white text-center text-4xl border-solid border-[5px] border-black w-60 h-16 ${className}`}
    >
      {children}
    </button>
  );
}

export default BasicButton;
