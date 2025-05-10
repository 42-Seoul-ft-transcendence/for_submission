import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import fetchWithAuth from '../../utils/fetchWithAuth'
import BasicButton from '../../common/BasicButton'
import Modal from '../../common/Modal'
import BlackProfile from '../../../assets/black_profile.svg'
import { participant } from '../../../types/Tournament'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	roomId: number
}

type Props = {
	isReady: boolean
  player1?: participant | null
	player2?: participant | null
}

function RoomModal({ isOpen, onClose, roomId }: ModalProps) {
	if (!isOpen) return null // 모달이 닫혀 있으면 렌더링 안 함
  
	const	[participants, setParticipants] = useState<participant[]>([])
	const [roomType, setRoomType] = useState<string>("2P")
	const	[inRoom, setInRoom] = useState<boolean>(false)
	const [isReady, setIsReady] = useState<boolean>(false)
	const navigate = useNavigate()

	async function updateRoomInfo() {
		try {
			const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE}/ft/api/tournaments/${roomId}`, navigate)
			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(errorData.message)
			}

			const data = await res.json()
			setRoomType(data.type)
			setParticipants(data.participants)

			if (data.status === "IN_PROGRESS") {
				let player = data.matches[0].players
				if (data.type === "4P")
					player = [...player, ...data.matches[1].players]
				setParticipants(player)
				setIsReady(true)
					for (const match of data.matches) {
						for (const player of match?.players ?? []) {
							if (player.id === Number(localStorage.getItem("userId"))) {
								await new Promise((resolve) => setTimeout(resolve, 2000))
								navigate(`/game?tournamentId=${data.id}&matchId=${match.id}`, {replace: true})
							}
						}
					}
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
			handleExit()
		}
	}

	useEffect(() => {
		updateRoomInfo()
		setInRoom(true)

    const intervalId = setInterval(updateRoomInfo, 3000)
    // 컴포넌트가 언마운트 될 때 인터벌 정리
    return () => clearInterval(intervalId)
  }, [])

	const handleExit = () => {
		setInRoom(false)
		fetchWithAuth(`${import.meta.env.VITE_API_BASE}/ft/api/tournaments/${roomId}/join`, navigate, {
			method: "DELETE"})
		.then((res) => {
			if (!res.ok) {
				return res.json().then(errorData => {
					throw new Error(errorData.message)
				})
			}
		})
		.catch((error) => {
			if (error instanceof Error) {
				alert(error.message)
			}
			else alert("오류가 발생했습니다.")
			navigate("/lobby")
			return
		})
		.finally(() => onClose())
	}

	return (
		<Modal isOpen={inRoom} onClose={handleExit} backgroundClick={false} className="w-[600px] h-[350px]">
					<div className="relative flex flex-col justify-center">
						{isReady ? <h1 className="flex justify-center text-yellow-300 text-5xl mb-[10px]">Round&nbsp;1</h1> :
							<h1 className="flex justify-center text-4xl mb-[10px]">Waiting...</h1>}
						<div className="relative flex flex-col items-center justify-center w-[600px] h-[200px] gap-[15px]">
							<PlayerProfile player1={participants?.[0]} player2={participants?.[1]} isReady={isReady}/>
							{roomType === "4P" && <PlayerProfile player1={participants?.[2]} player2={participants?.[3]} isReady={isReady}/>}
						</div>
					</div>
					{!isReady && 
						<BasicButton onClick={handleExit} className="!text-2xl !w-1/3 !h-1/5 cursor-pointer transition-transform hover:scale-105">Quit</BasicButton>}
		</Modal>
	)
}

const PlayerProfile = ({ isReady, player1 = null, player2 = null }: Props) => {
	const cssOption = "rounded-full border-2 border-black"
	
	return (
		<div className="flex justify-center gap-[4vh]">
			<div className="relative flex items-center justify-center flex-col">
				<div className={`relative w-1/3 ${player1 ? cssOption : ""} overflow-hidden`}>
					<img
						className="size-full"
						src={BlackProfile} />
					{player1 && <img
						className="absolute inset-0 size-full rounded-full object-cover"
						src={player1.image} />}
				</div>
				<p className="text-white text-center text-2xl">{player1 ? player1.name : "???"}</p>
			</div>
			{isReady && <p className="relative flex items-center justify-center text-2xl pb-3">VS</p>}
			<div className="relative flex items-center justify-center flex-col">
				<div className={`relative w-1/3 ${player2 ? cssOption : ""} overflow-hidden`}>
					<img
						className="size-full"
						src={BlackProfile} />
					{player2 && <img
						className="absolute inset-0 size-full rounded-full object-cover"
						src={player2.image} />}
					</div>
				<p className="text-white text-center text-2xl">{player2 ? player2.name : "???"}</p>
			</div>
		</div>
	)
}

export default RoomModal