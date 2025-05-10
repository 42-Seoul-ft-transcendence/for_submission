import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom';
import AcceptButton from '../../assets/button/accept_button.svg';
import RejectButton from '../../assets/button/reject_button.svg';
import BasicModal from '../common/Modal';
import BasicButton from '../common/BasicButton';
import { FriendRequest, FriendRequestListResponse } from '../../types/BuddyRequest';

function BuddyRequestContent() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_API_BASE}/ft/api/friends/requests/pending`,
          navigate,
          { method: 'GET' },
        );
        const data: FriendRequestListResponse = await res.json();
        setRequests(data.requests || []);
      } catch (error) {
        console.error('❌ 친구 요청 목록 가져오기 실패:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId: number, action: 'accept' | 'decline') => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_BASE}/ft/api/friends/request/${requestId}`,
        navigate,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action }),
        },
      );

      if (!res.ok) throw new Error('요청 처리 실패');

      // 성공 시 해당 요청 제거 및 메시지 표시
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setModalMessage(`Buddy request ${action}ed.`);
      setIsModalOpen(true);
    } catch (err) {
      console.error(`❌ 요청 처리 실패 (${action})`, err);
      alert(`Failed to ${action} buddy request.`);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-[#FFFBAA] text-6xl mt-6 font-bold">Buddy Requests</div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between bg-[#1f1f1f] w-[450px] p-4 mt-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={req.sender.image}
                alt={req.sender.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <span className="text-white text-3xl font-bold">{req.sender.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={AcceptButton}
                alt="Accept"
                className="w-20 h-10 cursor-pointer"
                onClick={() => handleAction(req.id, 'accept')}
              />
              <img
                src={RejectButton}
                alt="Reject"
                className="w-20 h-10 cursor-pointer"
                onClick={() => handleAction(req.id, 'decline')}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ 모달 메시지 출력 */}
      <BasicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="w-[350px] h-[200px] flex items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="text-white text-3xl font-bold mt-6"
            style={{
              textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
            }}
          >
            {modalMessage}
          </div>
          <BasicButton
            className="h-[2.5rem] w-[10rem] text-xl mt-8 border-2 border-black mb-0"
            onClick={() => setIsModalOpen(false)}
          >
            Back
          </BasicButton>
        </div>
      </BasicModal>
    </div>
  );
}

export default BuddyRequestContent;
