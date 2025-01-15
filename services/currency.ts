import {
	getCachedValue,
	setCachedValue,
	isValidCache,
	CacheData,
} from "./cache";

export async function getARSRate() {
	const CACHE_KEY = "ars_rate";
	const cached = getCachedValue(CACHE_KEY) as CacheData | null;

	if (isValidCache(cached)) {
		return { rate: cached.value, timestamp: cached.timestamp };
	}

	try {
		const response = await fetch("/api/ars-rate");
		const data = await response.json();
		const timestamp = Date.now();
		setCachedValue(CACHE_KEY, data.rate, timestamp);
		return { rate: data.rate, timestamp };
	} catch (error) {
		console.error("Error fetching ARS rate:", error);
		return {
			rate: 0,
			timestamp: Date.now(),
		};
	}
}

export async function getUSDRate() {
	const CACHE_KEY = "usd_rate";
	const cached = getCachedValue(CACHE_KEY) as CacheData | null;

	if (isValidCache(cached)) {
		return cached.value;
	}

	try {
		const response = await fetch("/api/usd-rate");
		const data = await response.json();
		setCachedValue(CACHE_KEY, data.rate);
		return data.rate;
	} catch (error) {
		console.error("Error fetching USD rate:", error);
		return 0;
	}
}

export async function getARSTarjetaRate() {
	const CACHE_KEY = "ars_tarjeta_rate";
	const cached = getCachedValue(CACHE_KEY) as CacheData | null;

	if (isValidCache(cached)) {
		return cached.value;
	}

	try {
		const response = await fetch("/api/ars-tarjeta-rate");
		const data = await response.json();
		setCachedValue(CACHE_KEY, data.rate);
		return data.rate;
	} catch (error) {
		console.error("Error fetching ARS Tarjeta rate:", error);
		return 0;
	}
}
