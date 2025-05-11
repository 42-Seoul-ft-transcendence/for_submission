import { match } from '../../../types/Tournament'
import BlackProfile from '/assets/black_profile.svg'

type Props = {
	match: match | undefined
}

const UserProfile = ({ match }: Props) => {
	if (!match) return

	return (
		<div className="relative flex justify-between w-full h-auto mt-2">
			<div className="relative flex items-center justify-center gap-[1vh]">
				<div className="relative flex w-24 h-24 rounded-full border-2 border-black overflow-hidden">
					<img
						className="size-full"
						src={BlackProfile} />
					<img
						className="absolute inset-0 size-full rounded-full object-cover"
						src={match.players[0].image} />
				</div>
				<p className="text-white text-center text-5xl">{match.players[0].name}</p>
			</div>
			<div className="relative flex items-center justify-center gap-[1vh]">
				<p className="text-white text-center text-5xl">{match.players[1].name}</p>
				<div className="relative flex w-24 h-24 rounded-full border-2 border-black overflow-hidden">
					<img
						className="size-full"
						src={BlackProfile} />
					<img
						className="absolute inset-0 size-full rounded-full object-cover"
						src={match.players[1].image} />
					</div>
			</div>
		</div>
	)
}

export default UserProfile