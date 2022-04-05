import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
	constructor(id, content, priority) {
		const bottomDropZone = DropZone.createDropZone();

		this.elements = {};
		this.elements.root = Item.createRoot();
		this.elements.input = this.elements.root.querySelector(".kanban__item-input");
		this.elements.select = this.elements.root.querySelector(".kanban__item-priority");

		this.elements.root.dataset.id = id;
		this.elements.input.textContent = content;
		this.elements.select.value = priority;
		this.content = content;
		this.priority = priority;
		console.log("PRIORIDAD THIS: "+this.priority);
		this.elements.root.appendChild(bottomDropZone);

		const onBlur = () => {
			const newContent = this.elements.input.textContent.trim();
			const newPriority = this.elements.select.value.trim();


			console.log("PRIORIDAD: "+newPriority);

			if (newContent == this.content && newPriority == this.priority) {
				console.log("INPUT && SELECT IGUAL");
				return;
			}

			this.content = newContent;
			this.priority = newPriority;

			console.log("ENVIADO: "+{priority: this.priority});

			KanbanAPI.updateItem(id, {content: this.content}, {priority: this.priority});
		};

		this.elements.input.addEventListener("blur", onBlur);
		this.elements.select.addEventListener("blur", onBlur);
		this.elements.root.addEventListener("dblclick", () => {
			const check = confirm("Are you sure you want to delete this item?");

			if (check) {
				KanbanAPI.deleteItem(id);

				this.elements.input.removeEventListener("blur", onBlur);
				this.elements.root.parentElement.removeChild(this.elements.root);
			}
		});



		/*Mobile version
		this.elements.root.addEventListener("touchstart", () => {
			const check = confirm("Are you sure you want to delete this item?");

			if (check) {
				KanbanAPI.deleteItem(id);

				this.elements.input.removeEventListener("blur", onBlur);
				this.elements.root.parentElement.removeChild(this.elements.root);
			}
		});*/

		this.elements.root.addEventListener("dragstart", e => {
			e.dataTransfer.setData("text/plain", id);
		});
		/*Mobile version
		this.elements.root.addEventListener("touchstart", e => {
			e.dataTransfer.setData("text/plain", id);
		});*/


		this.elements.input.addEventListener("drop", e => {
			e.preventDefault();
		});
	}

	static createRoot() {
		const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
			<div class="kanban__item" draggable="true">
			  <div class ="kanban__item-box">
				<select class="kanban__item-priority">
					<option value="0" selected>Prioridad Baja</option>
					<option value="1">Prioridad Media</option>
					<option value="2">Prioridad Alta</option>
				</select>
				<div class="kanban__item-input" contenteditable></div>
			  </div>
			</div>
		`).children[0];
	}
}
