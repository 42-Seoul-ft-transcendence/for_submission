import { useRef } from 'react';
import ReactDom from 'react-dom'

type SideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

const SideModal = ({ isOpen, onClose, children }: SideModalProps) => {
  if (!isOpen) return null
  
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return ReactDom.createPortal(
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`absolute right-0 top-0 h-full w-[500px] bg-black/90 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#858585] hover:text-black"
        >
          X
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>, document.body
  );
};

export default SideModal;
