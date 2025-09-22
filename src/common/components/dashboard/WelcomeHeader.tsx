import ActionCard from './ActionCard';

export interface ActionConfig {
  iconSrc: string;
  title: string;
  description: string;
  onClick: () => void;
  buttonText?: string;
}

interface WelcomeHeaderProps {
  userName: string;
  title?: string;
  actions: ActionConfig[];
  isSetupRequired?: boolean;
  setupPrompt?: React.ReactNode;
}

export default function WelcomeHeader({
  userName,
  title = "what do you want to do today?",
  actions,
  isSetupRequired = false,
  setupPrompt
}: WelcomeHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Welcome {userName}, {title}
      </h1>

      {isSetupRequired && setupPrompt ? (
        setupPrompt
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <ActionCard
              key={index}
              iconSrc={action.iconSrc}
              title={action.title}
              description={action.description}
              onClick={action.onClick}
              buttonText={action.buttonText}
            />
          ))}
        </div>
      )}
    </div>
  );
}