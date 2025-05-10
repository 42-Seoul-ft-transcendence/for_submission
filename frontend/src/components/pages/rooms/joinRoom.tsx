import fetchWithAuth from '../../utils/fetchWithAuth'

async function joinRoom(roomId: number, navigate: (path: string) => void): Promise<boolean> {
	try {
		const res = await fetchWithAuth(
			`${import.meta.env.VITE_API_BASE}/ft/api/tournaments/${roomId}/join`, navigate,
			{method: "POST"})

		if (!res.ok) {
			const errorData = await res.json()
			if (errorData.errorCode === "TOURNAMENT_006")
				return true
			throw new Error(errorData.message)
		}
		return true
	} 
	catch (error) {
		if (error instanceof Error) {
			alert(error.message)
		}
		else alert("방 참가에 실패하였습니다.")
		return false
	}
}

export default joinRoom