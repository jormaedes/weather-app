import ProjectManager from '../models/project_manager.js';

class Storage {
	static STORAGE_KEY = 'todoAppData';

	static save(projectManager) {
		try {
			const data = projectManager.toJSON();
			
			const jsonString = JSON.stringify(data);
			localStorage.setItem(Storage.STORAGE_KEY, jsonString);
			
			return true;
		} catch (error) {
			console.error('Erro ao salvar no localStorage:', error);
			return false;
		}
	}

	static load() {
		try {
			const jsonString = localStorage.getItem(Storage.STORAGE_KEY);
			
			if (!jsonString) {
				console.log('Nenhum dado encontrado. Criando novo ProjectManager.');
				return new ProjectManager();
			}

			const data = JSON.parse(jsonString);
			
			const projectManager = ProjectManager.fromJSON(data);
			
			console.log('Dados carregados com sucesso!');
			return projectManager;
			
		} catch (error) {
			console.error('Erro ao carregar do localStorage:', error);
			console.log('Criando novo ProjectManager devido ao erro.');
			return new ProjectManager();
		}
	}

	static clear() {
		try {
			localStorage.removeItem(Storage.STORAGE_KEY);
			console.log('Dados limpos com sucesso!');
			return true;
		} catch (error) {
			console.error('Erro ao limpar localStorage:', error);
			return false;
		}
	}

	static hasData() {
		return localStorage.getItem(Storage.STORAGE_KEY) !== null;
	}

	static exportData() {
		try {
			const jsonString = localStorage.getItem(Storage.STORAGE_KEY);
			if (!jsonString) {
				return null;
			}
			return JSON.parse(jsonString);
		} catch (error) {
			console.error('Erro ao exportar dados:', error);
			return null;
		}
	}

	static importData(jsonData) {
		try {
			const jsonString = JSON.stringify(jsonData);
			localStorage.setItem(Storage.STORAGE_KEY, jsonString);
			return true;
		} catch (error) {
			console.error('Erro ao importar dados:', error);
			return false;
		}
	}
}

export default Storage;
