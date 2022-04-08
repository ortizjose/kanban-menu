import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
	constructor(id, content, priority) {
		const bottomDropZone = DropZone.createDropZone();

		this.elements = {};
		this.elements.root = Item.createRoot();
		this.elements.input = this.elements.root.querySelector(".kanban__item-input");
		this.elements.select = this.elements.root.querySelector(".kanban__item-priority");
		this.elements.columMobile = this.elements.root.querySelector(".kanban__colum-select");

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



		/*Mobile version*/
		var touchstart;
		var touchend;
		document.addEventListener('contextmenu', event => event.preventDefault()); // No context menu 

		this.elements.root.addEventListener("touchstart", () => {
			
		 	touchstart = Date.now();

		},{passive: false});

		
		this.elements.root.addEventListener("touchend", event => {
			touchend = Date.now();

			if ( event.target.className === "kanban__item-box" || event.target.className === "kanban__item-box"  ) {

				if( (touchend - touchstart) < 500 ) { // Pulsacion corta
					console.log("CAMBIAR COLUMNA");

					if ( this.elements.columMobile.style.display === "none" || this.elements.columMobile.style.display === "" ) {

						this.elements.columMobile.style.display = "block";	
					}
					else {

						this.elements.columMobile.style.display = "none";
					}
				
					//console.log(this.elements.columMobile);
				}
				else { // Pulsacion larga
					console.log("¿BORRAR?");
				}

			console.log(touchend-touchstart);
			}
		});


		this.elements.root.addEventListener("dragstart", e => {
			e.dataTransfer.setData("text/plain", id);
		});


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
					<option value="0">Prioridad Baja</option>
					<option value="1">Prioridad Media</option>
					<option value="2">Prioridad Alta</option>
				</select>
				<div class="kanban__item-input" contenteditable></div>
				<div class="kanban__colum-select">
					<button class="kanban__colum-button col-md-3">Por Hacer</button>
					<button class="kanban__colum-button col-md-3">Haciendo</button>
					<button class="kanban__colum-button col-md-3">Hecho</button>
				</div>
			  </div>
			</div>
		`).children[0];
	}
}
