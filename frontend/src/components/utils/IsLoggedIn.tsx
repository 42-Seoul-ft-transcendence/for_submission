const IsLoggedIn = (): boolean => {
	if (localStorage.getItem("accessToken"))
		return true
	else
		return false
}

export default IsLoggedIn