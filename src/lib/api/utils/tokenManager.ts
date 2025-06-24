export class TokenManager {
	private static ACCESS_TOKEN_KEY = "learnbox_access_token";
	private static REFRESH_TOKEN_KEY = "learnbox_refresh_token";
	private static REMEMBER_ME_KEY = "learnbox_remember_me";

	static setTokens(
		tokens: { accessToken: string; refreshToken: string },
		rememberMe: boolean = false
	) {
		const storage = rememberMe ? localStorage : sessionStorage;

		storage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
		storage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);

		if (rememberMe) {
			localStorage.setItem(this.REMEMBER_ME_KEY, "true");
		}
	}

	static getAccessToken(): string | null {
		return (
			sessionStorage.getItem(this.ACCESS_TOKEN_KEY) ||
			localStorage.getItem(this.ACCESS_TOKEN_KEY)
		);
	}

	static getRefreshToken(): string | null {
		return (
			sessionStorage.getItem(this.REFRESH_TOKEN_KEY) ||
			localStorage.getItem(this.REFRESH_TOKEN_KEY)
		);
	}

	static isRememberMe(): boolean {
		return localStorage.getItem(this.REMEMBER_ME_KEY) === "true";
	}

	static clearTokens() {
		[localStorage, sessionStorage].forEach((storage) => {
			storage.removeItem(this.ACCESS_TOKEN_KEY);
			storage.removeItem(this.REFRESH_TOKEN_KEY);
		});
		localStorage.removeItem(this.REMEMBER_ME_KEY);
	}
}
