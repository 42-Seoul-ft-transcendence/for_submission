import { useState } from 'react';
import CreateRoom from '../../../assets/create_room.svg';
import CreateRoomModal from './CreateRoomModal';

const CreateRoomButton = () => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsCreatingRoom(true)}
        className="w-[25vw] max-w-[1000px] h-auto"
      >
        <img src={CreateRoom} alt="createRoomButton" className="w-full h-full object-contain" />
      </button>
      <CreateRoomModal
        isOpen={isCreatingRoom}
        onClose={() => setIsCreatingRoom(false)}
      />
    </div>
  );
};

export default CreateRoomButton;
