export interface CacheData {
	value: number;
	timestamp: number;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos en milisegundos

export const getCachedValue = (key: string): CacheData | null => {
	const cached = localStorage.getItem(key);
	if (!cached) return null;
	return JSON.parse(cached);
};

export const setCachedValue = (
	key: string,
	value: number,
	timestamp: number = Date.now()
) => {
	const data: CacheData = {
		value,
		timestamp,
	};
	localStorage.setItem(key, JSON.stringify(data));
};

export const isValidCache = (data: CacheData | null): data is CacheData => {
	if (!data) return false;
	return Date.now() - data.timestamp < CACHE_DURATION;
};
