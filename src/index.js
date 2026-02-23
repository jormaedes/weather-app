import './styles/style.css';
import WeatherAPI from './models/WeatherAPI';

class App {
	constructor() {
		this.weatherAPI = new WeatherAPI();
		this.response = null;
	}

	async getLocalData(local) {
		this.response = await this.weatherAPI.getDates(local);
		console.log(this.response);
	}
}

const app = new App();