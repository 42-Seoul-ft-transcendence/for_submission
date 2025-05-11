import { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom';
import { User, UserListResponse } from '../../types/User';
import AddBuddyIcon from '/assets/icon/AddBuddy.svg';
import BasicModal from '../common/Modal';
import BasicButton from '../common/BasicButton';

function AddBuddyContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_API_BASE}/ft/api/admin/users`,
          navigate,
          { method: 'GET' },
        );
        const data: UserListResponse = await res.json();
        setUsers(data.users ?? []);
      } catch (error) {
        console.error('유저 목록 가져오기 실패:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!inputValue) {
      setMatchedUser(null);
      return;
    }

    const matched = users.find((user) => user.name.toLowerCase() === inputValue.toLowerCase());
    setMatchedUser(matched || null);
  }, [inputValue, users]);

  const handleAddBuddy = async () => {
    if (!matchedUser) return;

    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_BASE}/ft/api/friends/request`,
        navigate,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverName: matchedUser.name,
          }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ 요청 실패:', res.status, errorData);
        throw new Error('친구 요청 실패');
      }

      setSuccessMessage(`Request sent to ${matchedUser.name}!`);
      setIsModalOpen(true);
    } catch (err) {
      alert('친구 추가 요청에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="text-[#FFFBAA] text-6xl mt-6">Buddy Invitation</div>
      <input
        className="border border-[#9FE1FC] w-[400px] mt-6 h-12 p-2 text-xl rounded-md"
        placeholder="Enter buddy name"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSuccessMessage('');
        }}
      />
      {matchedUser ? (
        <div className="flex items-center justify-between bg-[#1f1f1f] w-[400px] p-4 mt-6 rounded-lg">
          <div className="flex items-center gap-4">
            <img
              src={matchedUser.image}
              alt={matchedUser.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="text-2xl font-bold text-white">{matchedUser.name}</div>
          </div>
          <img
            src={AddBuddyIcon}
            alt="Add buddy"
            className="w-8 h-8 cursor-pointer"
            onClick={handleAddBuddy}
          />
        </div>
      ) : inputValue ? (
        <div className="mt-6 text-gray-400 text-lg">No matching user found</div>
      ) : null}

      {successMessage && <div className="mt-4 text-green-400 text-lg">{successMessage}</div>}

      <BasicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="w-[350px] h-[200px] flex items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="text-white text-4xl font-bold mt-6"
            style={{
              textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
            }}
          >
            Buddy request sent.
          </div>
          <BasicButton
            className="h-[2.5rem] w-[10rem] text-xl mt-6 border-2 border-black mb-0"
            onClick={() => setIsModalOpen(false)}
          >
            Back to Invitation
          </BasicButton>
        </div>
      </BasicModal>
    </div>
  );
}

export default AddBuddyContent;
