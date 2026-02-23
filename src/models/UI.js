import app from "..";

class UI{
	constructor()
	{
		this.urlIcon = "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/2nd%20Set%20-%20Color/";
		this.searchBtn1 = document.getElementById('search-btn');
		this.screenSearch = document.getElementById('screen-search');
		this.screenWeatger = document.getElementById('screen-weather');
		this.searchField = document.getElementById('search-field');
		this.searchField2 = document.getElementById('search-field-2');
		this.searchBtn2 = document.getElementById('search-btn-2');
		this.btnCelsius = document.getElementById('btn-celsius');
		this.btnFahrenheit = document.getElementById('btn-fahrenheit');
		this.iconCurrentTemp = document.getElementById('icon-current-temp');
	}


	init (){
		this.setUnitToggle();
		this.setEvents();
	}

	setUnitToggle(){
		this.btnCelsius.addEventListener('click', (e)=>{
			if (this.btnCelsius.classList.contains('active'))
				return ;
			this.btnFahrenheit.classList.remove('active');
			this.btnCelsius.classList.add('active')
		})

		this.btnFahrenheit.addEventListener('click', (e)=>{
			if (this.btnFahrenheit.classList.contains('active'))
				return ;
			this.btnCelsius.classList.remove('active');
			this.btnFahrenheit.classList.add('active')
		})
	}

	setEvents() {
		this.searchBtn1.addEventListener('click', async ()=> {
			const local = this.searchField.value;
			const response = await app.getLocalData(local.toLowerCase());
			if (!response)
				return ;
			this.screenSearch.style.display = 'none';
			this.screenWeatger.style.display = 'block';
			console.log(response);
			this.render(response);
		})
	}

	render(response) {
		this.iconCurrentTemp.src = `${this.urlIcon}${response.currentConditions.icon}.svg`;
	}
}

export default new UI();