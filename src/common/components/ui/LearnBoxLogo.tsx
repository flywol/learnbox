interface LearnBoxLogoProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export default function LearnBoxLogo({ size = "md", className = "" }: LearnBoxLogoProps) {
	const textSizes = {
		sm: "text-lg",
		md: "text-2xl",
		lg: "text-3xl",
	};
	const boxSizes = { sm: 16, md: 22, lg: 28 };
	const boxSize = boxSizes[size];

	return (
		<div className={`flex flex-col items-center leading-none select-none ${className}`}>
			<span className={`${textSizes[size]} font-bold text-[#2b2b2b] tracking-tight`}>
				Learn
			</span>
			<div className="flex items-center">
				<span className={`${textSizes[size]} font-bold text-[#2b2b2b] tracking-tight`}>B</span>
				{/* Isometric box replacing the 'o' */}
				<svg
					width={boxSize}
					height={boxSize}
					viewBox="0 0 22 20"
					fill="none"
					className="mx-[1px]"
					style={{ marginBottom: 1 }}
				>
					{/* Top face */}
					<polygon points="11,1 21,6 11,11 1,6" fill="#B03A0A" />
					{/* Left face */}
					<polygon points="1,6 11,11 11,19 1,14" fill="#FD5D26" />
					{/* Right face */}
					<polygon points="11,11 21,6 21,14 11,19" fill="#D4491B" />
				</svg>
				<span className={`${textSizes[size]} font-bold text-[#2b2b2b] tracking-tight`}>x</span>
			</div>
		</div>
	);
}
