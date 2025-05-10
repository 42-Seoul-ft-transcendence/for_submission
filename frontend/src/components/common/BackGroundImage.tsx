import { ReactNode } from 'react';

type Props= {
	className?: string;
	children?: ReactNode;
	backgroundImageUrl: string;
};

const BackGroundImage = ({ className="", children, backgroundImageUrl }: Props) => {
	return (
		<>
			<div
		      className={`relative w-full h-screen flex flex-col items-center justify-center bg-cover bg-center ${className}`}
		      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
		    >
		      {children}
		    </div>
		</>
	)
}

export default BackGroundImage