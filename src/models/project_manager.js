import { Project } from './project.js';
import Task from './task.js';

class ProjectManager {
	constructor() {
		this._projects = [];
		this._currentProjectId = null;
		this._initializeDefaultProject();
	}

	_initializeDefaultProject() {
		const defaultProject = new Project('Inbox');
		this._projects.push(defaultProject);
		this._currentProjectId = defaultProject.id;
	}

	get projects() {
		return this._projects;
	}

	get currentProject() {
		return this._projects.find(project => project.id === this._currentProjectId);
	}

	set currentProjectId(id) {
		const project = this.getProjectById(id);
		if (project) {
			this._currentProjectId = id;
			return true;
		}
		return false;
	}

	addProject(name) {
		if (!name || name.trim() === '') {
			return null;
		}
		const newProject = new Project(name.trim());
		this._projects.push(newProject);
		return newProject;
	}

	deleteProject(projectId) {
		if (this._projects.length <= 1) {
			return false;
		}

		if (projectId === this._currentProjectId) {
			return false;
		}

		const index = this._projects.findIndex(project => project.id === projectId);
		if (index !== -1) {
			this._projects.splice(index, 1);
			return true;
		}
		return false;
	}

	getProjectById(projectId) {
		return this._projects.find(project => project.id === projectId);
	}

	getProjectByName(name) {
		return this._projects.find(project => 
			project.name.toLowerCase() === name.toLowerCase()
		);
	}

	addTaskToCurrentProject(title, description, dueDate, priority) {
		const currentProject = this.currentProject;
		if (!currentProject) {
			return null;
		}

		const task = new Task(title, description, dueDate, priority);
		currentProject.appendTask(task);
		return task;
	}

	deleteTaskFromCurrentProject(taskId) {
		const currentProject = this.currentProject;
		if (!currentProject) {
			return false;
		}
		return currentProject.deleteTask(taskId);
	}

	deleteTaskFromProject(projectId, taskId) {
		const project = this.getProjectById(projectId);
		if (!project) {
			return false;
		}
		return project.deleteTask(taskId);
	}

	moveTask(taskId, fromProjectId, toProjectId) {
		const fromProject = this.getProjectById(fromProjectId);
		const toProject = this.getProjectById(toProjectId);

		if (!fromProject || !toProject) {
			return false;
		}

		const task = fromProject.getTaskById(taskId);
		if (!task) {
			return false;
		}
		fromProject.deleteTask(taskId);
		toProject.appendTask(task);
		return true;
	}

	getAllTasks() {
		const allTasks = [];
		this._projects.forEach(project => {
			project.tasks.forEach(task => {
				allTasks.push({
					task: task,
					projectId: project.id,
					projectName: project.name
				});
			});
		});
		return allTasks;
	}

	toJSON() {
		return {
			projects: this._projects.map(project => project.toJSON()),
			currentProjectId: this._currentProjectId
		};
	}

	static fromJSON(json) {
		const manager = new ProjectManager();
		
		manager._projects = [];
		
		if (json.projects && json.projects.length > 0) {
			manager._projects = json.projects.map(projectData => 
				Project.fromJSON(projectData)
			);
			manager._currentProjectId = json.currentProjectId;
		} else {
			manager._initializeDefaultProject();
		}
		return manager;
	}

	reset() {
		this._projects = [];
		this._currentProjectId = null;
		this._initializeDefaultProject();
	}
}

export default ProjectManager;