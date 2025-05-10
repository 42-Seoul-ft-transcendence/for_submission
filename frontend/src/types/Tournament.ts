export type participant = {
	id: number
	name: string
	image: string
}

export type player = {
	id: number
	name: string
	image: string
	score: number
	isWinner: boolean
}

export type match = {
	id: number
	round: number
	status: string
	createdAt: string
	updatedAt: string
	players: player[]
}

export interface tournament {
  id: number
  name: string
  type: string
	participants: participant[]
}

type wsPlayer = {
	y: number
	score: number
	userId: number
}

export type wsGameInfo = {
	player1: wsPlayer
	player2: wsPlayer
	ball: {
			x: number
			y: number
	}
}