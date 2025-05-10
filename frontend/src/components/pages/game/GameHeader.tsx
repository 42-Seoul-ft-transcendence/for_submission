import { useEffect, useRef, useState } from 'react'
import { wsGameInfo } from '../../../types/Tournament'

type Props = {
	isMulti: boolean
	matchStatus: string
	boardRef: React.RefObject<wsGameInfo>
}

const GameHeader = ({ isMulti, matchStatus, boardRef }: Props) => {
	const intervalRef = useRef<number | null>(null)
	const timer = useRef<number>(0)
	const [minute, setMinute] = useState<string>("00")
	const [second, setSecond] = useState<string>("00")

	useEffect(() => {
		if (matchStatus === "IN_PROGRESS") {
			if (intervalRef.current !== null) return

			intervalRef.current = window.setInterval(() => {
				timer.current += 1
				setMinute(String(Math.trunc(timer.current / 60)).padStart(2, "0"))
				setSecond(String(Math.trunc(timer.current % 60)).padStart(2, "0"))
			}, 1000)
		}
		if (matchStatus === "END") {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}

		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [matchStatus])

	return (
		<div className="relative fixed top-0 flex justify-between aspect-[1440/88] w-[90vw] max-w-[1440px] left-1/2 transform -translate-x-1/2 mb-5">
			<div className="relative w-1/5 max-w-[300px]">
        <img
          src="/src/assets/game/mode.svg"
          className="absolute bottom-0 w-full object-cover bottom-0" />
        <div className="absolute left-1/2 top-2/3 transform -translate-x-1/2 -translate-y-1/2 text-[3vw] inline-flex">{isMulti ? "4" : "2"}P&nbsp;Game</div>
      </div>
			<div className="absolute left-1/2 transform -translate-x-1/2 flex aspect-[324/88] max-w-[324px]">
				<div className="relative">
					<img
						src="/src/assets/game/leftScore.svg"
						className="w-[10vw] h-auto object-cover" />
					<p className="absolute text-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[4vw]">{boardRef.current.player1.score}</p>
				</div>
				<div className="relative">
					<img
						src="/src/assets/game/rightScore.svg"
						className="w-[10vw] h-auto object-cover" />
					<p className="absolute text-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[4vw]">{boardRef.current.player2.score}</p>
				</div>
			</div>
			<div className="relative items-center bg-[#444242] border-solid border-[5px] border-black border-2 w-[10vw] h-auto">
				<p className="absolute text-white text-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[3vw]">
					{minute}&nbsp;:&nbsp;{second}
				</p>
			</div>
		</div>
	)
}

export default GameHeader