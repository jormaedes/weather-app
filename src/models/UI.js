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
		this.city = document.getElementById('city-name');
		this.desc = document.getElementById('description');
		this.currentTemp = document.getElementById('current-temp');
		this.humidity = document.getElementById("humidity-stat");
		this.uv = document.getElementById("uv-stat");
		this.wind = document.getElementById("wind-stat");
		this.feelslike = document.getElementById("feelslike");

		
	}

	_getClesuisTemp(tmp){
		const f = parseFloat(tmp);
		return ((f - 32) * (5 / 9)).toFixed(0);
	}

	_getFahrenheitTemp(tmp){
		const c = parseInt(tmp);
		return ((c * 1.8) + 32).toFixed(0);
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
			this.currentTemp.textContent = `${this._getClesuisTemp(this.currentTemp.textContent)}°`;
		})

		this.btnFahrenheit.addEventListener('click', (e)=>{
			if (this.btnFahrenheit.classList.contains('active'))
				return ;
			this.btnCelsius.classList.remove('active');
			this.btnFahrenheit.classList.add('active')
			this.currentTemp.textContent = `${this._getFahrenheitTemp(this.currentTemp.textContent)}°`;
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
		this.city.textContent = response.address.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		this.desc.textContent = response.description;
		this.currentTemp.textContent = `${this._getClesuisTemp(response.currentConditions.temp)}°`;
		this.iconCurrentTemp.src = `${this.urlIcon}${response.currentConditions.icon}.svg`;
		this.feelslike.textContent = `${
			this._getClesuisTemp(response.currentConditions.feelslike)
		}°`;
		this.humidity.textContent = `${response.currentConditions.humidity}%`;
		this.uv.textContent = response.currentConditions.uvindex;
		this.wind.textContent = response.currentConditions.windspeed;
		this._renderHouerSlot(response);
	}

	_renderHouerSlot(response){
		const hours = response.days[0].hours;
		const hourSlot = [hours[6], hours[9], hours[12], hours[15], hours[18], hours[21]];
		const hourSlotEl = [...document.querySelectorAll('.hour-slot')];
		const h = ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM']
		const hs1 = new Date();
		if (hs1.getHours() >= 6 && hs1.getHours() <= 8)
			hourSlotEl[0].classList.add('current');
		else if (hs1.getHours() >= 9 && hs1.getHours() <= 11)
			hourSlotEl[1].classList.add('current');
		else if (hs1.getHours() >= 12 && hs1.getHours() <= 14)
			hourSlotEl[2].classList.add('current');
		else if (hs1.getHours() >= 15 && hs1.getHours() <= 17)
			hourSlotEl[3].classList.add('current');
		else if (hs1.getHours() >= 18 && hs1.getHours() <= 20)
			hourSlotEl[4].classList.add('current');
		else
			hourSlotEl[5].classList.add('current');
		console.log(hourSlot);
		for(let i = 0; i < hourSlot.length; i++) {
			hourSlotEl[i].innerHTML = '';
			hourSlotEl[i].innerHTML = ` <span class="hour-label">${h[i]}</span>
				<img src="${this.urlIcon}${hourSlot[i].icon}.svg" class="hour-icon">
				<span class="hour-temp">${this._getClesuisTemp(hourSlot[i].temp)}°</span>
			`;
		}
	}
}

export default new UI();