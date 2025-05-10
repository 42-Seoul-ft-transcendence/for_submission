import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogo from '../../assets/header_logo.svg';
import InvitationIcon from '../../assets/icon/invitation.svg';
import BuddyIcon from '../../assets/icon/buddy.svg';
import MenuIcon from '../../assets/icon/menu.svg';
import SideModal from '../modal/SideModal';
import MypageContent from '../modal/MyPageContent';
import BuddyContent from '../modal/BuddyContent';
import InvitationContent from '../modal/BuddyRequestContent';

const Header = () => {
  const navigate = useNavigate();
  const [isMypageModal, setIsMypageModal] = useState(false);
  const [isBuddyModal, setIsBuddyModal] = useState(false);
  const [isInvitationModal, setIsInvitationModal] = useState(false);

  const handleMainButton = () => {
    navigate('/lobby');
  };

  return (
    <header className="fixed top-0 w-full flex items-center justify-between bg-black/70 h-24">
      <img
        src={HeaderLogo}
        alt="Header Logo"
        onClick={handleMainButton}
        className="cursor-pointer w-80 ml-0"
      />
      <nav className="space-x-4 flex flex-row mr-3">
        <img
          src={InvitationIcon}
          onClick={() => setIsInvitationModal(true)}
          className="w-10 mr-3 cursor-pointer"
        />
        <img
          src={BuddyIcon}
          onClick={() => setIsBuddyModal(true)}
          className="w-10 cursor-pointer"
        />
        <img
          src={MenuIcon}
          onClick={() => setIsMypageModal(true)}
          className="w-10 cursor-pointer"
        />
      </nav>

      <SideModal isOpen={isInvitationModal} onClose={() => setIsInvitationModal(false)}>
        <InvitationContent />
      </SideModal>

      <SideModal isOpen={isMypageModal} onClose={() => setIsMypageModal(false)}>
        <MypageContent />
      </SideModal>

      <SideModal isOpen={isBuddyModal} onClose={() => setIsBuddyModal(false)}>
        <BuddyContent />
      </SideModal>
    </header>
  );
};

export default Header;
