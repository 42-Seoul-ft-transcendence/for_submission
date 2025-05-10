import { useNavigate } from 'react-router-dom';
import JoinRoom from '../../../assets/join_room.svg';

const JoinRoomButton = () => {
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    navigate('/rooms');  // 방 리스트 페이지로 이동
  };

  return (
    <div>
      <button
        onClick={handleJoinRoom}
        className="w-[25vw] max-w-[1000px] h-auto"
      >
        <img src={JoinRoom} alt="Join Room Button" className="w-full h-full object-contain" />
      </button>
    </div>
  );
};

export default JoinRoomButton;
