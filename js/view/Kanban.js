import Column from "./Column.js";
import Modal from "./Modal.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Kanban {
	constructor(root) {
		this.root = root;

		Kanban.columns().forEach(column => {
			const columnView = new Column(column.id, column.title);


			this.root.appendChild(columnView.elements.root);

		});

		const priorityButtons = document.getElementsByClassName('kanban__item-priority');			
		KanbanAPI.cambioColor(priorityButtons);
	}

	static columns() {
		return [
			{
				id: 1,
				title: "Por Hacer"
			},
			{
				id: 2,
				title: "Haciendo"
			},
			{
				id: 3,
				title: "Hecho"
			}
		];
	}
}

