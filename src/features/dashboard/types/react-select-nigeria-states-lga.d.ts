// Create this file as: src/types/react-select-nigeria-states-lga.d.ts

declare module "react-select-nigeria-states-lga" {
	interface StateInputStyle {
		width?: string;
		padding?: string;
		border?: string;
		borderRadius?: string;
		fontSize?: string;
		outline?: string;
		transition?: string;
		marginTop?: string;
	}

	interface ReactNaijaStateLgaSelectProps {
		naijaState: string;
		naijaLga: string;
		towns: string[];
		setNaijaState: (state: string) => void;
		setNaijaLga: (lga: string) => void;
		setLga: (towns: string[]) => void;
		statePlaceholder?: string;
		lgaPlaceholder?: string;
		stateInputStyle?: StateInputStyle;
		lgaInputStyle?: StateInputStyle;
	}

	export const ReactNaijaStateLgaSelect: React.FC<ReactNaijaStateLgaSelectProps>;
}
