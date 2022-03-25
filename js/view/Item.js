import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
	constructor(id, content) {
		const bottomDropZone = DropZone.createDropZone();

		this.elements = {};
		this.elements.root = Item.createRoot();
		this.elements.input = this.elements.root.querySelector(".kanban__item-input");

		this.elements.root.dataset.id = id;
		this.elements.input.textContent = content;
		this.content = content;
		this.elements.root.appendChild(bottomDropZone);

		const onBlur = () => {
			const newContent = this.elements.input.textContent.trim();

			if (newContent == this.content) {
				return;
			}

			this.content = newContent;

			KanbanAPI.updateItem(id, {
				content: this.content
			});
		};

		this.elements.input.addEventListener("blur", onBlur);
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
			    <div class="select">
					<select class="kanban__item-priority">
						<option value="-1" selected> Elegir Prioridad</option>
						<option class="priority_0" value="0">Prioridad Baja</option>
						<option class="priority_1" value="1">Prioridad Media</option>
						<option class="priority_2" value="2">Prioridad Alta</option>
					</select>
				</div>
				<div class="kanban__item-input" contenteditable></div>
			  </div>
			</div>
		`).children[0];
	}
}
