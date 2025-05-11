import BackGroundImage from '../../common/BackGroundImage.tsx';
import CreateRoomButton from './CreateRoomButton.tsx';
import JoinRoomButton from './JoinRoomButton.tsx';
import Header from '../../common/Header.tsx';

const LobbyPage = () => {
  return (
    <BackGroundImage backgroundImageUrl="/assets/background/background_lobby.png">
      <Header />
      <div className="flex gap-[15vh] mb-5">
        <CreateRoomButton />
        <JoinRoomButton />
      </div>
    </BackGroundImage>
  );
};

export default LobbyPage;
