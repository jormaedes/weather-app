export default class Task {
	constructor(title, description, dueDate, priority) {
		this._id = crypto.randomUUID();
		this._title = title;
		this._description = description;
		this._dueDate = dueDate;
		this._priority = priority;
		this._checked = false;
	}

	set checked(checked) {
		this._checked = checked;
	}

	set title(title) {
		this._title = title;
	}

	set description(description) {
		this._description = description;
	}

	set dueDate(newDueDate) {
		this._dueDate = newDueDate;
	}

	set priority(priority) {
		const validPriorities = ['low', 'medium', 'high'];
		if (validPriorities.includes(priority)) {
			this._priority = priority;
		} else {
			this._priority = 'medium';
		}
	}

	get title() {
		return (this._title);
	}

	get description() {
		return (this._description);
	}

	get dueDate() {
		return (this._dueDate);
	}

	get priority() {
		return (this._priority);
	}

	get checked() {
		return (this._checked);
	}

	get id() {
		return (this._id);
	}

	toggleChecked() {
		this._checked = !this._checked;
	}

	toJSON() {
		return {
			id: this._id,
			title: this._title,
			description: this._description,
			dueDate: this._dueDate,
			priority: this._priority,
			checked: this._checked
		};
	}

	static fromJSON(json) {
		const task = new Task(
			json.title, 
			json.description, 
			json.dueDate, 
			json.priority
		);
		task._id = json.id;
		task._checked = json.checked;
		return (task);
	}
}
