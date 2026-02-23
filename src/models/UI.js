import app from "..";

class UI{
	constructor()
	{
		this.searchBtn1 = document.getElementById('search-btn');
		this.screenSearch = document.getElementById('screen-search');
		this.screenWeatger = document.getElementById('screen-weather');
		this.searchField = document.getElementById('search-field');

	}


	init (){
		this.setEvents();
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
		})
	}
}

export default new UI();