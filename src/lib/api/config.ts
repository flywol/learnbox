interface ApiConfig {
	baseUrl: string;
	environment: "development" | "staging" | "production";
	timeout: number;
}

const getApiConfig = (): ApiConfig => {
	const env = import.meta.env.MODE;

	return {
		baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
		environment: env as any,
		timeout: 30000,
	};
};

export const API_CONFIG = getApiConfig();
