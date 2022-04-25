import Column from "./Column.js";
import Modal from "./Modal.js";

export default class Kanban {
	constructor(root) {
		this.root = root;

		Kanban.columns().forEach(column => {
			const columnView = new Column(column.id, column.title);

			this.root.appendChild(columnView.elements.root);
		});
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
