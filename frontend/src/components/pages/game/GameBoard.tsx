import { useEffect, useRef } from 'react'
import { wsGameInfo } from '../../../types/Tournament'

const GameBoard = ({ boardRef }: {boardRef: React.RefObject<wsGameInfo>}) => {
	const ballRef = useRef<HTMLImageElement>(null)
  const leftPaddleRef = useRef<HTMLImageElement>(null)
  const rightPaddleRef = useRef<HTMLImageElement>(null)
	const frameRef = useRef<number>(0)


	useEffect(() => {
    const animate = () => {
			const board = boardRef.current

      if (ballRef.current) {
        ballRef.current.style.left = `${(board.ball.x * 10)/ 144}%`
        ballRef.current.style.top = `${(board.ball.y * 10) / 53}%`
      }
			if (leftPaddleRef.current) {
        leftPaddleRef.current.style.top = `${(board.player1.y * 10) / 53}%`
      }
			if (rightPaddleRef.current) {
        rightPaddleRef.current.style.top = `${(board.player2.y * 10) / 53}%`
      }


      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

		return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

	return (
		<div className="relative aspect-[144/53] w-[90vw] max-w-[1600px] h-auto left-1/2 transform -translate-x-1/2">
			<img 
				className="absolute top-0 left-0 w-full h-full object-cover z-0"
				src="/src/assets/game/board.svg" />
				<div className="absolute inset-0 flex justify-center items-center">
					<div className="relative w-[90%] aspect-[1440/530]">
						<img
							ref={ballRef}
							src="/src/assets/game/ball.svg"
							className="absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
							alt="Ball"
						/>

						{/* 막대기 (예: 왼쪽) */}
						<img
							ref={leftPaddleRef}
							src="/src/assets/game/bar.svg"
							className="absolute z-10 h-[20%] left-[0%] top-1/2"
							alt="Left Paddle"
						/>

						{/* 막대기 (예: 오른쪽) */}
						<img
							ref={rightPaddleRef}
							src="/src/assets/game/bar.svg"
							className="absolute z-10 h-[20%] right-[0%] top-1/2"
							alt="Right Paddle"
						/>
				</div>
			</div>
		</div>
	)
}

export function PaddleControl(ws: WebSocket | null, isStarted: boolean) {
  const keyPressedRef = useRef<"ArrowUp" | "ArrowDown" | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStarted && (e.key === "ArrowUp" || e.key === "ArrowDown") && keyPressedRef.current !== e.key) {
        keyPressedRef.current = e.key
        sendDirection(e.key === "ArrowUp" ? "up" : "down")
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isStarted && e.key === keyPressedRef.current) {
        keyPressedRef.current = null
        sendDirection("stop")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isStarted])

  const sendDirection = (direction: "up" | "down" | "stop") => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "move_paddle", data: direction }))
    }
  }

  return null // 이 컴포넌트는 입력만 처리
}

export default GameBoard