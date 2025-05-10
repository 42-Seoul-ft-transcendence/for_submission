import BackGroundImage from '../common/BackGroundImage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import fetchWithAuth from '../utils/fetchWithAuth';

interface participants {
  id: number;
  name: string;
  image: string;
}

interface tournaments {
  id: number;
  name: string;
  type: string;
  participants: participants[];
}

const RoomListPage = () => {
  const [rooms, setRooms] = useState<tournaments[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [playerNumber, setPlayerNumber] = useState<number>(2);

  const navigate = useNavigate();
  let totalPage = 0;

  useEffect(() => {
    fetchWithAuth(
      `${import.meta.env.VITE_API_BASE}/ft/api/tournaments?page=${pageNumber}&limit=20&type=${playerNumber}P`,
      navigate,
    )
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setRooms(data.tournaments);
        totalPage = data.totalPage;
      })
      .finally(() => setLoading(false))
      .catch(() => {
        alert('게임방을 불러오지 못했습니다.');
        navigate('/lobby');
      });
  }, [pageNumber, playerNumber]);

  const handlePrev = () => {
    if (pageNumber > 0) setPageNumber((prev) => prev - 1);
  };

  const handleNext = () => {
    if (pageNumber < totalPage) setPageNumber((prev) => prev + 1);
  };

  return (
    <>
      <BackGroundImage backgroundImageUrl="src/assets/background/background_basic.png">
        <Header />
        <div className="flex gap-[2vh] mb-5">
          <button
            className={`px-4 py-2 rounded-lg ${playerNumber == 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setPlayerNumber(2)}
          >
            2P
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${playerNumber == 4 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setPlayerNumber(4)}
          >
            4P
          </button>
        </div>
        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="p-4 border rounded bg-green-500 hover:bg-green-700 cursor-pointer"
                onClick={() => console.log(`${room.id} 참가 요청`)}
              >
                <strong>{room.name}</strong> – {room.participants.length}명 참여 중
              </li>
            ))}
          </ul>
        )}
        <div className="flex mt-6">
          <button
            className="w-0 h-0 mr-4
            	border-t-8 border-b-8 border-r-8 
            	border-t-transparent border-b-transparent border-r-black"
            onClick={handlePrev}
          />
          <p>
            {pageNumber + 1} / {totalPage + 1}
          </p>
          <button
            className="w-0 h-0 ml-4
            	border-t-8 border-b-8 border-l-8 
            	border-t-transparent border-b-transparent border-l-black"
            onClick={handleNext}
          />
        </div>
      </BackGroundImage>
    </>
  );
};

export default RoomListPage;
