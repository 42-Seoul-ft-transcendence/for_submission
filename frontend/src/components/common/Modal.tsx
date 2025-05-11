import ModalBackGround from '/assets/modal.svg';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  backgroundClick?: boolean
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, className = '', backgroundClick = true, children }: ModalProps) {
  if (!isOpen) return null;

  // 배경 클릭 시 닫히게 처리
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (backgroundClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackgroundClick} // 배경 클릭시만 닫기
    >
      {/* 모달 박스 */}
      <div className={`relative flex flex-col items-center justify-center shadow-lg ${className}`}>
        {/* 모달 백그라운드 이미지 */}
        <img
          src={ModalBackGround}
          alt="Modal Background"
          className="absolute inset-0 w-full h-full object-cover rounded-lg pointer-events-none"
        />

        {/* 위에 얹히는 내용 */}
        <div className="relative w-full flex flex-col items-center gap-4 z-10">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
