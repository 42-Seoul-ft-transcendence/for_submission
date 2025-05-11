import BackGroundImage from '../../common/BackGroundImage'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../common/Header'
import fetchWithAuth from '../../utils/fetchWithAuth'
import joinRoom from './joinRoom'
import RoomModal from './RoomModal'
import JoinButton from '/assets/button/join_button.svg'
import Button2pDefault from '/assets/button/2p_yellow.svg'
import Button4pDefault from '/assets/button/4p_yellow.svg'
import Button2pActive from '/assets/button/2p_orange.svg'
import Button4pActive from '/assets/button/4p_orange.svg'
import { tournament } from '../../../types/Tournament'

const RoomListPage = () => {
  const [rooms, setRooms] = useState<tournament[]>([])
  const [loading, setLoading] = useState(true)
	const [isWaiting, setIsWaiting] = useState(false)
	const [pageNumber, setPageNumber] = useState<number>(0)
	const [playerNumber, setPlayerNumber] = useState<number>(2)
	const [totalPage, setTotalPage] = useState<number>(1)

	const navigate = useNavigate()
	const { roomid } = useParams<{ roomid?: string }>()

	useEffect(() => {
		if (roomid) {
			if (isNaN(+roomid)) {
				alert("잘못된 접근입니다.")
				navigate("/lobby", { replace: true })
				return
			}
			else setIsWaiting(true)
		}
		else setIsWaiting(false)
	}, [roomid, navigate])

  useEffect(() => {
		fetchWithAuth(`${import.meta.env.VITE_API_BASE}/ft/api/tournaments?page=${pageNumber}&limit=5&type=${playerNumber}P`, navigate)
		.then((res) => {
			if (!res.ok)
				throw new Error()
			return res.json()
		})
		.then((data) => {
			setRooms(data.tournaments)
			setTotalPage(data.totalPages)
		})
		.catch(() => {
			alert("게임방을 불러오지 못했습니다.")
			navigate("/lobby")
			return
		})
		.finally(() => setLoading(false))
  }, [pageNumber, playerNumber, isWaiting])

	const handleChangeMode = (mode: number) => {
		setPlayerNumber(mode)
		setPageNumber(0)
	}

	const handlePrev = () => {
		if (pageNumber > 0)
			setPageNumber(prev => prev - 1)
	}

	const handleNext = () => {
		if (pageNumber < totalPage - 1)
			setPageNumber(prev => prev + 1)
	}

	const handleJoinRoom = async (roomId: number) => {
		const result = await joinRoom(roomId, navigate)
		if (result) {
			navigate(`/room/${roomId}`)
			return
		}
		else {
			handleChangeMode(playerNumber)
		}
	}

  return (
		<>
			<BackGroundImage backgroundImageUrl='/assets/background/background_basic.png'>
				<Header />
				<div className="flex flex-col gap-[2vh] top-0 items-center justify-left pt-24">
					<div className="flex w-24 gap-[2vh] justify-center mt-4">
						<img
							src={playerNumber === 2 ? Button2pActive : Button2pDefault}
							className={`${playerNumber == 2 ? "" : "cursor-pointer transition-transform hover:scale-105"}`}
							onClick={() => handleChangeMode(2)} />
						<img
							src={playerNumber === 4 ? Button4pActive : Button4pDefault}
							className={`${playerNumber == 4 ? "" : "cursor-pointer transition-transform hover:scale-105"}`}
							onClick={() => handleChangeMode(4)} />
					</div>
					{isWaiting && <RoomModal isOpen={isWaiting} onClose={() => navigate("/rooms")} roomId={+roomid!} />}
					{ loading ? (<p>불러오는 중...</p>) : (
						<ul className="space-y-2">
							{rooms.map((room) => (
								<li
									key={room.id}
									className="flex items-center w-[800px] h-24 border rounded bg-[#D9FBF6]"
								>
									<strong className="text-3xl text-left w-[500px] whitespace-normal break-words text-gray-600 pl-4">
										{room.name}
									</strong>
									<div className="text-2xl relative flex ml-auto">
										<div className="flex p-4">
											<p className="text-gray-500">
												{room.participants.length}&nbsp;
											</p>
											<p>
												/&nbsp;{playerNumber}
											</p>
										</div>
										<img 
											src={JoinButton}
											className="flex justify-center w-20 mr-2 cursor-pointer transition-transform hover:scale-105"
											onClick={() => handleJoinRoom(room.id)} />
									</div>
								</li>
							))}
						</ul>
					)}
					<div className="flex mt-2">
						<button 
							className="w-0 h-0 mr-4
								border-t-8 border-b-8 border-r-8 
								border-t-transparent border-b-transparent border-r-black"
							onClick={handlePrev} />
						<p>{pageNumber + 1} / {totalPage == 0 ? 1 : totalPage}</p>
						<button 
							className="w-0 h-0 ml-4
								border-t-8 border-b-8 border-l-8 
								border-t-transparent border-b-transparent border-l-black"
							onClick={handleNext} />
					</div>
				</div>
			</BackGroundImage>
		</>
  );
};

export default RoomListPage