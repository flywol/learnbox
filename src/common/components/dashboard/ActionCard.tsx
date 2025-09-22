interface ActionCardProps {
  iconSrc: string;
  title: string;
  description: string;
  onClick: () => void;
  buttonText?: string;
}

export default function ActionCard({
  iconSrc,
  title,
  description,
  onClick,
  buttonText = "Start"
}: ActionCardProps) {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <img src={iconSrc} alt={title} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
      <button className="w-full py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
        {buttonText}
      </button>
    </div>
  );
}