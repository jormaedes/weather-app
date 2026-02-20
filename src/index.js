import './styles/style.css';
import Storage from './utils/storage.js';
import render from './ui/render.js';
import events from './ui/events.js';

class App {
	constructor() {
		this.projectManager = null;
		this.currentView = 'inbox';
	}

	init() {
		console.log('Iniciando aplicação...');
		this.loadData();
		this.renderInitialUI();
		events.init();
	}

	loadData() {
		this.projectManager = Storage.load();
		console.log('Dados carregados:', this.projectManager);
	}

	renderInitialUI() {
		render.renderGeneralSection();

		render.renderProjects(
			this.projectManager.projects,
			this.projectManager.currentProject.id
		);
		this.showInbox();
		this.loadTheme();
	}

	showInbox() {
		this.currentView = 'inbox';
		const inboxProject = this.projectManager.projects[0];
		render.renderTasks(inboxProject.tasks, inboxProject.name);
		render.setActiveView('inbox');
	}

	showToday() {
		this.currentView = 'today';
		const today = new Date().toISOString().split('T')[0];
		
		const todayTasks = this.projectManager.getAllTasks()
			.filter(item => item.task.dueDate === today)
			.map(item => item.task);

		render.renderTasks(todayTasks, 'Today');
		render.setActiveView('today');
	}

	showProject(projectId) {
		this.currentView = 'project';
		this.projectManager.currentProjectId = projectId;

		const project = this.projectManager.currentProject;
		render.renderTasks(project.tasks, project.name);
		render.setActiveProject(projectId);

		Storage.save(this.projectManager);
	}

	loadTheme() {
		const savedTheme = localStorage.getItem('theme') || 'light';
		document.body.className = savedTheme;
		
		const icon = document.querySelector('#icon-toggle-theme');
		if (savedTheme === 'dark') {
			icon.className = 'ri-sun-fill';
		} else {
			icon.className = 'ri-moon-fill';
		}
	}

	toggleTheme() {
		const currentTheme = document.body.className;
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
		
		document.body.className = newTheme;
		localStorage.setItem('theme', newTheme);

		const icon = document.querySelector('#icon-toggle-theme');
		if (newTheme === 'dark') {
			icon.className = 'ri-sun-fill';
		} else {
			icon.className = 'ri-moon-fill';
		}
	}
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => {
	app.init();
});

export default app;