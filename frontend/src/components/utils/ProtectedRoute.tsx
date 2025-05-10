import React from 'react';
import { Navigate } from 'react-router-dom'
import IsLoggedIn from './IsLoggedIn'

function ProtectedRoute ({ children }: { children: React.ReactNode }) {
	if (!IsLoggedIn()) {
		alert("로그인이 필요합니다.")
		return <Navigate to="/login" replace />
	}
	return children
}

export default ProtectedRoute