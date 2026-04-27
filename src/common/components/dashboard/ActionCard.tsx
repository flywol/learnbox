interface ActionCardProps {
  iconSrc: string;
  title: string;
  description?: string;
  onClick: () => void;
  buttonText?: string;
}

export default function ActionCard({
  iconSrc,
  title,
  onClick,
  buttonText = "Start",
}: ActionCardProps) {
  return (
    <div
      className="border border-[#d6d6d6] rounded-xl h-28 overflow-hidden flex flex-col items-center justify-center gap-2 px-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 w-full justify-center">
        <img src={iconSrc} alt={title} className="w-12 h-12 object-contain flex-shrink-0" />
        <p className="text-base font-medium text-black leading-snug">{title}</p>
      </div>
      <button
        className="w-full h-6 bg-[#fd5d26] text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        {buttonText}
      </button>
    </div>
  );
}
