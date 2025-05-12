import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BackGroundImage from '../../common/BackGroundImage'
import GameHeader from './GameHeader'
import GameBoard, { PaddleControl } from './GameBoard'
import UserProfile from './UserProfile'
import BasicButton from '../../common/BasicButton'
import fetchWithAuth from '../../utils/fetchWithAuth'
import BlackProfile from '/assets/black_profile.svg'
import Modal from '../../common/Modal'
import { match, wsGameInfo } from '../../../types/Tournament'

type Props = {
	match: match | undefined
	isMulti: boolean
	tournamentId: string | null
}

const GamePage = () => {
	const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
	const navigate = useNavigate()
	const tournamentId = searchParams.get("tournamentId")
	const matchId = searchParams.get("matchId")

	const socketRef = useRef<WebSocket | null>(null)
	const board = useRef<wsGameInfo>({
		player1: { y: 215, score: 0, userId: 0 },
		player2: { y: 215, score: 0, userId: 0 },
		ball: { x: 720, y: 265 }
	})
	const [matchStatus, setMatchStatus] = useState<string>("PENDDING")
	const [match, setMatch] = useState<match>()
	const [isMulti, setIsMulti] = useState<boolean>(false)
	const [isStarted, setIsStarted] = useState<boolean>(false)
	const [waiting, setWaiting] = useState<string>("waitng...")

	useEffect(() => {
		if (!tournamentId || !matchId)
		{
			alert("잘못된 접근입니다.")
			navigate("/lobby", {replace: true})
		}

		if (matchStatus === "IN_PROGRESS") return

		const getTournamentInfo = async () => {
			try {
				const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE}/ft/api/tournaments/${tournamentId}`, navigate)
				if (!res.ok) {
					const errorData = await res.json()
					throw new Error(errorData.message)
				}
	
				const data = await res.json()
			
				if (data.type === "4P")
					setIsMulti(true)

				let foundMatch = null
				for (const match of data.matches) {
					if (match.id === Number(matchId)) {
						setMatch(match)
						foundMatch = match
						break
					}
				}
				if (!foundMatch)
					throw new Error("매치를 찾을 수 없습니다.")
			} catch (error) {
				if (error instanceof Error) {
					alert(error.message)
				}
				navigate("/lobby", {replace: true})
			}
		}

		getTournamentInfo()
	}, [matchStatus])

	useEffect(() => {
		if (!match || match.status === "COMPLETED" || !matchId) return

		const str = `${import.meta.env.VITE_API_BASE}`
		const api_base = str.replace("https://", "")

		const delayMs = 1000


		const timeoutId = setTimeout(() => {
			const ws = new WebSocket(`wss://${api_base}/ft/ws/match/${matchId}`)
			socketRef.current = ws

			const accessToken = localStorage.getItem("accessToken")
			if (!accessToken) {
				alert("로그인이 필요합니다.")
				navigate("/")
			}

			ws.onopen = () => {
				ws.send(JSON.stringify({ "type" : "authenticate",
																"token" : accessToken }))
			}
		
			ws.onmessage = (event) => {
				const data = JSON.parse(event.data)
				if (data.type === "game_start") {
					setIsStarted(true)
					setMatchStatus("IN_PROGRESS")
				}
				else if (data.type === "waiting")
					setWaiting(data.countDown)
				else if (data.type === "game_update")
					board.current = data.data
				else if (data.type === "game_end")
					setMatchStatus("COMPLETED")
			}

			ws.onerror = () => {
				alert("오류가 발생했습니다.")
				navigate("/lobby")
			}

			ws.onclose = () => {
			}
		}, delayMs)
	
		return () => {
			console.log("🧹 WebSocket cleanup")
			clearTimeout(timeoutId)
			socketRef.current?.close()
		}
	}, [match])

	PaddleControl(socketRef.current, isStarted)

	return (
		<>
			<BackGroundImage backgroundImageUrl='/assets/background/background_basic.png'>
				<Modal isOpen={!isStarted && match?.status !== "COMPLETED"} onClose={() => {}} className="w-[360px] h-[210px] text-3xl">{waiting}</Modal>
				{match?.status === "COMPLETED" ? <MatchResult match={match} isMulti={isMulti} tournamentId={tournamentId}/> : (
					<div className="relative flex flex-col w-full">
						<GameHeader isMulti={isMulti} matchStatus={matchStatus} boardRef={board}/>
						<GameBoard boardRef={board}/>
						<UserProfile match={match}/>
					</div>
				)}
			</BackGroundImage>
		</>
	)
}

const MatchResult = ({ match, isMulti, tournamentId }: Props) => {
	if (!match || match.status !== "COMPLETED") return null

	const navigate = useNavigate()
	const [isWinner, setIsWinner] = useState<boolean>(false)
	
	useEffect(() => {
		if (!match) return
		
		const userId = localStorage.getItem("userId")
		const player = match.players.find(p => p.id === Number(userId))
		if (player)
			setIsWinner(player.isWinner)
	}, [match])

	useEffect(() => {
		handleMultiWin()
	}, [isWinner])

	async function handleMultiWin() {
		if (isMulti && match?.round === 1 && isWinner) {
			await new Promise((resolve) => setTimeout(resolve, 5000))
			navigate(`/round2/${tournamentId}`, {replace:true})
		}
	}

	const handleButton = () => {
		if (!isMulti || match?.round === 2 || !isWinner)
			navigate("/lobby", {replace: true})
		else 
			navigate(`/round2/${tournamentId}`, {replace: true})
	}

	return (
		<div className="relative flex flex-col items-center w-80% h-80% border rounded bg-[#D9FBF6] gap-[3vh]">
			<h1 className="text-gray-500 text-5xl">You&nbsp;{isWinner ? "Win!" : "Lose..."}</h1>
			<div className="flex justify-center gap-[4vh]">
				<div className="relative flex items-center justify-center flex-col">
					<div className="relative w-1/3 rounded-full border-2 border-black overflow-hidden">
						<img
							className="size-full"
							src={BlackProfile} />
						<img
							className="absolute inset-0 size-full rounded-full object-cover"
							src={match.players[0].image} />
					</div>
					<p className="text-blacktext-center text-2xl">{match.players[0].name}</p>
				</div>
				<p className="relative flex items-center justify-center text-8xl text-green-300 font-mono">
					{match!.players[0].score}&nbsp;:&nbsp;{match.players[1].score}
				</p>
				<div className="relative flex items-center justify-center flex-col">
					<div className="relative w-1/3 rounded-full border-2 border-black overflow-hidden">
						<img
							className="size-full"
							src={BlackProfile} />
						<img
							className="absolute inset-0 size-full rounded-full object-cover"
							src={match.players[1].image} />
						</div>
					<p className="text-black text-center text-2xl">{match.players[1].name}</p>
				</div>
			</div>
			<BasicButton onClick={handleButton}>{isMulti && match?.round === 1 && isWinner ? "Next" : "Back to Lobby"}</BasicButton>
		</div>
	)
}

export default GamePage