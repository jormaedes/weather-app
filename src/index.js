import './styles/style.css';
import WeatherAPI from './models/WeatherAPI';
import UI from './models/UI';

class App {
	constructor() {
		this.weatherAPI = new WeatherAPI();
		this.response = null;
		UI.init();
	}

	async getLocalData(local) {
		this.response = await this.weatherAPI.getDates(local);
		console.log(this.response);
		return (this.response);
	}
}

const app = new App();

export default app;