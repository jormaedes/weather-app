import app from '../index.js';
import Storage from '../utils/storage.js';
import render from './render.js';

class Events {
	constructor() {
		this.addProjectDialog = document.querySelector('#add-project-dialog');
		this.addTaskDialog = document.querySelector('#add-task-dialog');
		this.aboutDialog = document.querySelector('#about-dialog');
		this.currentEditTaskId = null;
		this.editTaskDialog = document.querySelector('#edit-task-dialog');
	}

	init() {
		this.setupThemeEvents();
		this.setupSidebarEvents();
		this.setupTaskEvents();
		this.setupDialogEvents();
	}

	setupSidebarEvents() {
		document.querySelector('#general-section').addEventListener('click', (e) => {
			const item = e.target.closest('.project-item');
			if (!item) return;

			const view = item.getAttribute('data-view');
			if (view === 'inbox') {
				app.showInbox();
			} else if (view === 'today') {
				app.showToday();
			}
		});

		document.querySelector('.project-list').addEventListener('click', (e) => {
			if (e.target.closest('.delete-project-item')) {
				const projectItem = e.target.closest('.project-item');
				const projectId = projectItem.getAttribute('data-project-id');
				this.handleDeleteProject(projectId);
				return;
			}

			const item = e.target.closest('.project-item');
			if (!item) return;

			const projectId = item.getAttribute('data-project-id');
			app.showProject(projectId);
		});

		document.querySelector('#add-project-btn').addEventListener('click', () => {
			this.openAddProjectDialog();
		});

	}

	setupTaskEvents() {
		document.querySelector('#add-task-btn').addEventListener('click', () => {
			this.openAddTaskDialog();
		});

		document.querySelector('#tasks-container').addEventListener('click', (e) => {
			const taskCard = e.target.closest('.task-card');
			if (!taskCard) return;

			const taskId = taskCard.getAttribute('data-task-id');

			if (e.target.classList.contains('task-checkbox')) {
				this.handleToggleTask(taskId);
				return;
			}

			if (e.target.closest('.edit-task-item')) {
				console.log(taskId);
				this.openEditTaskDialog(taskId);
				return;
			}

			if (e.target.closest('.delete-task-item')) {
				this.handleDeleteTask(taskId);
				return;
			}
		});
	}

	openEditTaskDialog(taskId) {
		let task = null;
		for (const project of app.projectManager.projects) {
			task = project.getTaskById(taskId);
			if (task) break;
		}

		if (!task) return;

		this.currentEditTaskId = taskId;

		document.querySelector('#edit-title-input').value = task.title;
		document.querySelector('#edit-description-input').value = task.description;
		document.querySelector('#edit-due-date-input').value = task.dueDate;

		const prioritySelect = document.querySelector('#edit-priority-input');
		prioritySelect.value = task.priority;
		prioritySelect.setAttribute('edit-data-priority', task.priority);

		this.editTaskDialog.showModal();
		document.querySelector('#edit-title-input').focus();
	}

	setupDialogEvents() {
		const projectInput = document.querySelector('#name-project-input');

		document.querySelector('#confirm-add-project-btn').addEventListener('click', (e) => {
			e.preventDefault();
			const projectName = projectInput.value.trim();

			if (projectName) {
				this.handleAddProject(projectName);
				projectInput.value = '';
				this.addProjectDialog.close();
			}
		});

		document.querySelector('#cancel-add-project-btn').addEventListener('click', () => {
			projectInput.value = '';
			this.addProjectDialog.close();
		});

		const taskForm = this.addTaskDialog.querySelector('form');

		document.querySelector('#confirm-add-task-btn').addEventListener('click', (e) => {
			e.preventDefault();

			const title = document.querySelector('#title-input').value.trim();
			const description = document.querySelector('#description-input').value.trim();
			const dueDate = document.querySelector('#due-date-input').value;
			const priority = document.querySelector('#priority-input').value;

			if (title && dueDate) {
				this.handleAddTask(title, description, dueDate, priority);
				taskForm.reset();
				this.addTaskDialog.close();
			}
		});

		document.querySelector('#cancel-add-task-btn').addEventListener('click', () => {
			taskForm.reset();
			this.addTaskDialog.close();
		});

		const prioritySelect = document.querySelector('#priority-input');
		prioritySelect.addEventListener('change', (e) => {
			e.target.setAttribute('data-priority', e.target.value);
		});

		document.querySelector('#about-btn').addEventListener('click', () => {
			this.aboutDialog.showModal();
		});

		document.querySelector('#close-info-btn').addEventListener('click', () => {
			this.aboutDialog.close();
		});

		// editar task
		const editTaskForm = this.editTaskDialog.querySelector('form');
		const editPrioritySelect = document.querySelector('#edit-priority-input');


		editPrioritySelect.addEventListener('change', (e) => {
			e.target.setAttribute('data-priority', e.target.value);
		});

		// Botão save-edit
		document.querySelector('#confirm-edit-task-btn').addEventListener('click', (e) => {
			e.preventDefault();

			const title = document.querySelector('#edit-title-input').value.trim();
			const description = document.querySelector('#edit-description-input').value.trim();
			const dueDate = document.querySelector('#edit-due-date-input').value;
			const priority = document.querySelector('#edit-priority-input').value;

			if (title && dueDate) {
				this.handleEditTask(this.currentEditTaskId, {
					title,
					description,
					dueDate,
					priority
				});
				editTaskForm.reset();
				this.editTaskDialog.close();
				this.currentEditTaskId = null;
			}
		});

		// Botão cancelar o edit
		document.querySelector('#cancel-edit-task-btn').addEventListener('click', () => {
			editTaskForm.reset();
			this.editTaskDialog.close();
			this.currentEditTaskId = null;
		});
	}

	handleEditTask(taskId, newData) {
		let task = null;
		for (const project of app.projectManager.projects) {
			task = project.getTaskById(taskId);
			if (task) break;
		}

		if (!task) {
			console.error('Task not found:', taskId);
			return;
		}

		task.title = newData.title;
		task.description = newData.description;
		task.dueDate = newData.dueDate;
		task.priority = newData.priority;

		Storage.save(app.projectManager);

		render.updateTaskElement(taskId, task);
		console.log('Task edited:', task.title);
	}

	setupThemeEvents() {
		document.querySelector('#toggle-theme-btn').addEventListener('click', () => {
			app.toggleTheme();
		});
	}

	handleAddProject(name) {
		const newProject = app.projectManager.addProject(name);

		if (!newProject) {
			alert('Failed to create project');
			return;
		}

		Storage.save(app.projectManager);

		render.renderProjects(
			app.projectManager.projects,
			app.projectManager.currentProject.id
		);

		console.log('Project added:', name);
	}

	handleAddTask(title, description, dueDate, priority) {
		if (app.currentView === 'today' || app.currentView === 'inbox') {
			const inboxProject = app.projectManager.projects[0];
			app.projectManager.currentProjectId = inboxProject.id;
		}

		const newTask = app.projectManager.addTaskToCurrentProject(
			title,
			description,
			dueDate,
			priority
		);

		if (!newTask) {
			alert('Failed to create task');
			return;
		}

		Storage.save(app.projectManager);

		if (app.currentView === 'project' || app.currentView === 'inbox') {
			render.addTaskToDOM(newTask);
		} else if (app.currentView === 'today') {
			app.showToday();
		}

		const project = app.projectManager.currentProject;
		render.updateProjectCount(project.id, project.tasks.length);

		console.log('Task added:', title);
	}

	handleToggleTask(taskId) {
		let task = null;
		let projectId = null;

		for (const project of app.projectManager.projects) {
			task = project.getTaskById(taskId);
			if (task) {
				projectId = project.id;
				break;
			}
		}

		if (!task) {
			console.error('Task not found:', taskId);
			return;
		}

		task.toggleChecked();

		Storage.save(app.projectManager);

		const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
		if (taskElement) {
			taskElement.setAttribute('data-completed', task.checked);
		}

		console.log('Task toggled:', task.title, '→', task.checked);
	}


	handleDeleteProject(projectId) {
		const inboxId = app.projectManager.projects[0].id;
		if (projectId === inboxId) {
			alert('The Inbox project cannot be deleted!');
			return;
		}

		const project = app.projectManager.getProjectById(projectId);
		if (!confirm(`Delete project "${project.name}"? All tasks will be lost.`)) return;

		if (app.projectManager.currentProject.id === projectId) {
			app.projectManager.currentProjectId = app.projectManager.projects[0].id;
			app.showInbox();
		}

		app.projectManager.deleteProject(projectId);

		Storage.save(app.projectManager);

		render.renderProjects(
			app.projectManager.projects,
			app.projectManager.currentProject.id
		);

		console.log('Project deleted:', project.name);
	}

	handleDeleteTask(taskId) {
		if (!confirm('Are you sure you want to delete this task?')) return;

		let projectWithTask = null;

		for (const project of app.projectManager.projects) {
			if (project.getTaskById(taskId)) {
				projectWithTask = project;
				break;
			}
		}

		if (!projectWithTask) {
			console.error('Task not found:', taskId);
			return;
		}

		projectWithTask.deleteTask(taskId);

		Storage.save(app.projectManager);

		render.removeTaskFromDOM(taskId);

		render.updateProjectCount(projectWithTask.id, projectWithTask.tasks.length);

		console.log('Task deleted:', taskId);
	}

	openAddProjectDialog() {
		this.addProjectDialog.showModal();
		document.querySelector('#name-project-input').focus();
	}

	openAddTaskDialog() {
		const today = new Date().toISOString().split('T')[0];
		document.querySelector('#due-date-input').setAttribute('min', today);
		this.addTaskDialog.showModal();
		document.querySelector('#title-input').focus();
	}
}

export default new Events();