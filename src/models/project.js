import Task from './task.js';

export class Project {
	constructor(name) {
		this._id = crypto.randomUUID();
		this._name = name;
		this._tasks = [];
	}

	set name(name) {
		if (name != '')
			this._name = name;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get tasks() {
		return this._tasks;
	}

	deleteTask(taskId) {
		const index = this._tasks.findIndex(task => task.id === taskId);
		if (index !== -1) {
			this._tasks.splice(index, 1);
			return true;
		}
		return false;
	}

	getTaskById(taskId) {
		return this._tasks.find(task => task.id === taskId);
	}

	appendTask(task) {
		if (task)
			this._tasks.push(task);
	}

	toJSON() {
		return {
			id: this._id,
			name: this._name,
			tasks: this._tasks.map(task => task.toJSON())
		};
	}

	static fromJSON(json) {
		const project = new Project(json.name);
		project._id = json.id;
		project._tasks = json.tasks.map(taskData => Task.fromJSON(taskData));
		return project;
	}
}
