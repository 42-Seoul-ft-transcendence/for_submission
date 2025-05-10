import { useNavigate } from 'react-router-dom';
import BackGroundImage from '../common/BackGroundImage'
import GameStart from '../../assets/button/start_button.svg';
import Logo from '../../assets/logo.svg';

function MainPage() {
  return (
    <BackGroundImage backgroundImageUrl="/src/assets/background/background_main.png">
				<div className="flex flex-col items-center justify-between h-full gap-[5vh]">
					{/* <img src={BackGround} className="w-full h-full object-cover" alt="background" /> */}
					<img 
						src={Logo}
						className="w-[50vw] max-w-[1000px] h-auto object-contain mt-[15vh]"
						alt="logo" />
					<GameStartButton />
				</div>
    </BackGroundImage>
  )
}

const GameStartButton = () => {
	const navigate = useNavigate()

	const handleGameStart = () => {
		navigate("/login")
	}
	return (
		<button 
			onClick={handleGameStart} 
			className="w-[30vw] max-w-[1000px] h-auto mb-[25vh]"
		>
			<img src={GameStart} alt="gameStartButton" className="w-full h-full object-contain" />
		</button>
	)
}

export default MainPage