class Render {
	constructor() {
		this.generalSection = document.querySelector('#general-section');
		this.projectList = document.querySelector('.project-list');
		this.tasksContainer = document.querySelector('#tasks-container');
		this.mainTitle = document.querySelector('#main-title');
	}

	// Renderizar a seção general (Inbox, Today)
	renderGeneralSection() {
		const title = this.generalSection.querySelector('.section-title');
		this.generalSection.innerHTML = '';
		this.generalSection.appendChild(title);

		const generalItems = [
			{ name: 'Inbox', icon: 'ri-inbox-fill', view: 'inbox' },
			{ name: 'Today', icon: 'ri-calendar-fill', view: 'today' }
		];

		generalItems.forEach(item => {
			const itemElement = this._createGeneralItem(item);
			this.generalSection.appendChild(itemElement);
		});
	}

	_createGeneralItem(item) {
		const div = document.createElement('div');
		div.classList.add('project-item');
		div.setAttribute('data-view', item.view);

		div.innerHTML = `
			<i class="${item.icon}"></i>
			${item.name}
		`;
		return div;
	}

	// RENDERIZAR LISTA DE PROJETOS
	renderProjects(projects, currentProjectId) {
		this.projectList.innerHTML = '';

		projects.forEach(project => {
			const projectElement = this._createProjectElement(project);
			if (project.name == 'Inbox') return ;
			if (project.id === currentProjectId) {
				projectElement.classList.add('active-project');
			}
			this.projectList.appendChild(projectElement);
		});
	}

	_createProjectElement(project) {
		const div = document.createElement('div');
		div.classList.add('project-item');
		div.setAttribute('data-project-id', project.id);

		const taskCount = project.tasks.length;

		div.innerHTML = `
			<h3 class="project-name">${project.name}</h3>
			<div class="info-project">
				<span class="qtd-project">${taskCount}</span>
				<button class="delete-project-item" title="delete project">
					<i class="ri-delete-bin-fill"></i>
				</button>
			</div>
		`;
		return div;
	}


	// RENDERIZAR TASKS
	renderTasks(tasks, title = 'Inbox') {
		this.mainTitle.textContent = title;
		this.tasksContainer.innerHTML = '';

		if (tasks.length === 0) {
			this.tasksContainer.innerHTML = '<p class="empty-message">No tasks yet. Add one!</p>';
			return;
		}

		tasks.forEach(task => {
			const taskElement = this._createTaskElement(task);
			this.tasksContainer.appendChild(taskElement);
		});
	}

	_createTaskElement(task) {
		const div = document.createElement('div');
		div.classList.add('task-card');
		div.setAttribute('data-task-id', task.id);
		div.setAttribute('data-priority', task.priority);
		div.setAttribute('data-completed', task.checked);
		
		const formattedDate = this._formatDate(task.dueDate);
		div.innerHTML = `
			<div class="task-card-left">
				<input type="checkbox" class="task-checkbox" ${task.checked ? 'checked' : ''}>
				<div class="task-content">
					<h3 class="task-title">${task.title}</h3>
					<p class="task-description">${task.description}</p>
				</div>
			</div>
			<div class="task-card-right">
				<span class="task-date">
					<i class="ri-calendar-fill"></i>
					${formattedDate}
				</span>
				<button class="edit-task-item" title="edit task">
					<i class="ri-edit-box-fill"></i>
				</button>
				<button class="delete-task-item" title="delete task">
					<i class="ri-delete-bin-fill"></i>
				</button>
			</div>
		`;
		return div;
	}

	updateTaskElement(taskId, task) {
		const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
		if (!taskElement) return;

		taskElement.setAttribute('data-priority', task.priority);
		taskElement.setAttribute('data-completed', task.checked);

		taskElement.querySelector('.task-title').textContent = task.title;
		taskElement.querySelector('.task-description').textContent = task.description;
		taskElement.querySelector('.task-checkbox').checked = task.checked;
		
		const formattedDate = this._formatDate(task.dueDate);
		taskElement.querySelector('.task-date').innerHTML = `
			<i class="ri-calendar-fill"></i>
			${formattedDate}
		`;
	}

	addTaskToDOM(task) {
		const taskElement = this._createTaskElement(task);
		if (this.tasksContainer.innerHTML == '<p class="empty-message">No tasks yet. Add one!</p>')
			this.tasksContainer.innerHTML = '';
		this.tasksContainer.appendChild(taskElement);
	}

	removeTaskFromDOM(taskId) {
		const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
		if (taskElement) {
			taskElement.remove();
		}
	}

	updateProjectCount(projectId, count) {
		const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
		if (!projectElement) return;

		const countElement = projectElement.querySelector('.qtd-project');
		if (countElement) {
			countElement.textContent = count;
		}
	}

	setActiveProject(projectId) {
		document.querySelectorAll('.project-item').forEach(item => {
			item.classList.remove('active-project');
		});

		const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
		if (projectElement) {
			projectElement.classList.add('active-project');
		}
	}

	setActiveView(view) {
		document.querySelectorAll('.project-item').forEach(item => {
			item.classList.remove('active-project');
		});

		const viewElement = document.querySelector(`[data-view="${view}"]`);
		if (viewElement) {
			viewElement.classList.add('active-project');
		}
	}

	_formatDate(dateString) {
		const months = ["Jan", 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', "Dec"];
		const date = new Date(dateString);		
		const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
		return formattedDate;
	}
}

export default new Render();