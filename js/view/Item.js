import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
	constructor(id, content, priority) {
		const bottomDropZone = DropZone.createDropZone();

		this.elements = {};
		this.elements.root = Item.createRoot();
		this.elements.input = this.elements.root.querySelector(".kanban__item-input");
		this.elements.select = this.elements.root.querySelector(".kanban__item-priority");
		this.elements.columMobile = this.elements.root.querySelector(".kanban__column-select");
		this.elements.buttonColum1 = this.elements.root.querySelector(".button-1");
		this.elements.buttonColum2 = this.elements.root.querySelector(".button-2");
		this.elements.buttonColum3 = this.elements.root.querySelector(".button-3");



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



		/* ### STAR MOBILE EVENTS ### */
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

					if ( this.elements.columMobile.style.display === "none" || this.elements.columMobile.style.display === "" )
						this.elements.columMobile.style.display = "block";	
					else 
						this.elements.columMobile.style.display = "none";
				
					//console.log(this.elements.columMobile);
				}
				else { // Pulsacion larga
					console.log("¿BORRAR?");
				}

			console.log(touchend-touchstart);
			}
		});


		/* Change column mobille start 
		const dropZone = new DropZone();
		console.log(dropZone.dropZone);

		this.elements.buttonColum1.addEventListener("click", () => {

			console.log("HOLA1");

		});

		this.elements.buttonColum2.addEventListener("click", e => {
			console.log("HOLA2 "+id);

			const droppedItemElement = document.querySelector(`[data-id="${id}"]`);			
			const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

			if (droppedItemElement.contains(dropZone)) {
				return;
			}

			insertAfter.after(droppedItemElement);

			KanbanAPI.updateItem(id,{
				columnId: 2,
				position: 1
			});
			location.reload(true);
		});

		this.elements.buttonColum3.addEventListener("click", () => {

			console.log("HOLA3");

		});
		 Change column mobille stop */

		this.elements.buttonColum2.addEventListener("click", e => {
				DropZone.changeColumn(id);
		});



		/* ### START DESKTOP EVENTS ### */
		this.elements.root.addEventListener("dragstart", e => {
			e.dataTransfer.setData("text/plain", id);
		});


		this.elements.input.addEventListener("drop", e => {
						//console.log("2");

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

				<div class="kanban__item-delete">

				<div>
					
				<div class="kanban__column-select">
					<button class="kanban__column-button button-1 col-md-3">Por Hacer</button>
					<button class="kanban__column-button button-2 col-md-3">Haciendo</button>
					<button class="kanban__column-button button-3 col-md-3">Hecho</button>
				</div>

			  </div>
			</div>
		`).children[0];
	}
}
