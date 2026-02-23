class WeatherAPI {
	constructor() {
		this._key = "3S2U53LTNQ2HK7KCNQDYVVHYY";
		this._url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
	}

	async getDates(local) {
		try {
			const search = `${this._url}${local}?key=${this._key}`;
			const response = await fetch(search);

			if (!response.ok)
				throw new Error(`API error: ${response.status} - ${response.statusText}`);
			return await response.json();
		} catch (error) {
			console.error(`Request erro: ${error}`);
			return null;
		}
	}
}

export default WeatherAPI;