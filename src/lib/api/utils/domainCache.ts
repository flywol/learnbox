interface CacheEntry {
	data: any;
	timestamp: number;
}

export class DomainCache {
	private static CACHE_KEY = "learnbox_verified_domains";
	private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

	static set(domain: string, schoolData: any) {
		const cache = this.getCache();
		cache[domain] = {
			data: schoolData,
			timestamp: Date.now(),
		};
		localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
	}

	static get(domain: string): any | null {
		const cache = this.getCache();
		const entry = cache[domain];

		if (entry && Date.now() - entry.timestamp < this.CACHE_DURATION) {
			return entry.data;
		}

		// Remove expired entry
		if (entry) {
			delete cache[domain];
			localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
		}

		return null;
	}

	static clear() {
		localStorage.removeItem(this.CACHE_KEY);
	}

	private static getCache(): Record<string, CacheEntry> {
		const cached = localStorage.getItem(this.CACHE_KEY);
		return cached ? JSON.parse(cached) : {};
	}
}
