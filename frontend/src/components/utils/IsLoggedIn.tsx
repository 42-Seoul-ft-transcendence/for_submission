const IsLoggedIn = (): boolean => {
	const accessToken = localStorage.getItem("accessToken")
	if (accessToken)
		return true
	else
		return false
}

export default IsLoggedIn