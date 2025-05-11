import { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import ProfilePlaceholder from '/assets/black_profile.svg';
import SettingIcon from '/assets/icon/setting.svg';
import { MatchInfo, MatchesResponse, UserInfo } from '../../types/MyMatch';
import { useNavigate } from 'react-router-dom';
import EditProfileContent from './EditProfileContent';
import SideModal from './SideModal';
// import { mockMatches } from '../../mocks/matches';

const MypageContent = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const matchesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetchWithAuth(
          `${import.meta.env.VITE_API_BASE}/ft/api/users/me`,
          navigate,
          { method: 'GET' },
        );
        const userData = await userResponse.json();
        setUserInfo(userData);
        console.log(userData);

        const matchesResponse = await fetchWithAuth(
          `${import.meta.env.VITE_API_BASE}/ft/api/users/me/matches/history`,
          navigate,
          { method: 'GET' },
        );
        const matchesData: MatchesResponse = await matchesResponse.json();
        setMatches(matchesData.matches);
        // setMatches(mockMatches.matches);
      } catch (err: unknown) {
        console.error('데이터 가져오기 실패', err);
        setError(err instanceof Error ? err.message : '알 수 없는 에러');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!userInfo) return <div>유저 정보를 찾을 수 없습니다.</div>;

  const totalPages = Math.ceil(matches.length / matchesPerPage);
  const startIndex = (currentPage - 1) * matchesPerPage;
  const currentMatches = matches.slice(startIndex, startIndex + matchesPerPage);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* 유저 프로필 */}
      <div className="flex flex-row items-center gap-8">
        <img
          src={userInfo.image ? userInfo.image : ProfilePlaceholder}
          className="w-[100px] h-[100px] rounded-full object-cover"
        />
        <div className="text-5xl text-white">{userInfo.name}</div>
        <img
          src={SettingIcon}
          onClick={() => setIsEditModalOpen(true)}
          className="cursor-pointer"
        />
      </div>

      <hr className="w-full h-[3px] bg-[#2c2c2c] my-2 border-none" />

      {/* 매치 기록 / 안내 문구 */}
      {matches.length === 0 ? (
        <div className="text-center text-white text-3xl mt-12">
          You haven't played any matches yet. <br />
          <span className="text-yellow-200 font-semibold">Let's play your first game!</span>
        </div>
      ) : (
        <>
          {/* Match History */}
          <div className="mt-2 w-full max-w-2xl h-[27rem]">
            <h2 className="text-center text-yellow-200 text-3xl font-bold mb-6">Match History</h2>

            <div className="grid grid-cols-4 text-gray-400 text-lg font-semibold border-b border-gray-600 pb-2 mb-4">
              <div className="text-left">Result</div>
              <div className="text-center">Count</div>
              <div className="text-center">vs</div>
              <div className="text-right">Date</div>
            </div>

            {/* 고정 높이 설정 */}
            <div className="space-y-4">
              {currentMatches.map((match) => (
                <div
                  key={match.id}
                  className="grid grid-cols-4 items-center border-b border-gray-600 pb-2"
                >
                  <div
                    className={`text-left font-bold text-xl ${
                      match.isWinner ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {match.isWinner ? 'win' : 'lose'}
                  </div>
                  <div className="text-center text-white text-xl">
                    {match.myScore}:{match.opponentScore}
                  </div>
                  <div className="text-center text-white">{match.opponentName}</div>
                  <div className="text-right text-white text-xl">
                    {new Date(match.playedAt).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1 rounded bg-gray-600 text-white disabled:opacity-50"
                >
                  prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-yellow-300 text-black font-bold'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-3 py-1 rounded bg-gray-600 text-white disabled:opacity-50"
                >
                  next
                </button>
              </div>
            )}
          </div>

          {/* 승패 통계 */}
          <div className="flex flex-col justify-center items-center mt-8">
            <h1 className="text-[#FFFBAA] text-3xl mb-4">Win/Lose Stats</h1>
            <div className="text-3xl text-white mb-2">win {userInfo.wins}</div>
            <div className="text-3xl text-white">lose {userInfo.losses}</div>
          </div>
        </>
      )}

      <SideModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
      >
        <EditProfileContent
          onSaveSuccess={() => {
            setIsEditModalOpen(false); // 모달 닫기
            setLoading(true); // 로딩 처리
            setError(null); // 에러 초기화

            // 다시 fetch
            (async () => {
              try {
                const userResponse = await fetchWithAuth(
                  `${import.meta.env.VITE_API_BASE}/ft/api/users/me`,
                  navigate,
                  { method: 'GET' },
                );
                const userData = await userResponse.json();
                setUserInfo(userData);
              } catch (err) {
                console.error('❌ 프로필 갱신 실패:', err);
                setError('프로필 갱신 실패');
              } finally {
                setLoading(false);
              }
            })();
          }}
          initial2FAEnabled={userInfo.twoFactorEnabled}
        />
      </SideModal>
    </div>
  );
};

export default MypageContent;
