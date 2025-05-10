import './App.css'
import './index.css'
import './components/pages/MainPage.tsx';
import MainPage from './components/pages/MainPage.tsx';
import LoginPage from './components/pages/LoginPage.tsx';
import AuthenticatePage from './components/pages/AuthenticatePage.tsx'
import RegisterPage from './components/pages/RegisterPage.tsx';
import VerifyPage from './components/pages/VerifyPage.tsx';
import LobbyPage from './components/pages/lobby/LobbyPage.tsx';
import RoomListPage from './components/pages/rooms/RoomListPage.tsx';
import RoundTwoPage from './components/pages/game/RoundTwoPage.tsx';
import GamePage from './components/pages/game/GamePage.tsx';
import ProtectedRoute from './components/utils/ProtectedRoute.tsx';
import NotFoundPage from './components/pages/NotFoundPage.tsx';

import {Route, Routes, Navigate } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route index element={<Navigate to={"/main"} replace />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/authenticate" element={<AuthenticatePage />} />
      <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
      <Route path="/verify" element={<ProtectedRoute><VerifyPage /></ProtectedRoute>} />
      <Route path="/lobby" element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
      <Route path="/rooms" element={<ProtectedRoute><RoomListPage /></ProtectedRoute>} />
      <Route path="/room/:roomid" element={<ProtectedRoute><RoomListPage /></ProtectedRoute>} />
      <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      <Route path="/round2/:tournamentId" element={<ProtectedRoute><RoundTwoPage /></ProtectedRoute>} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
