import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";
import Column from "./Column.js";
import Modal from "./Modal.js";

export default class Item {
	constructor(id, content, priority) {
		const bottomDropZone = DropZone.createDropZone();
		//debugger;	
		const ModalButton = new Modal(id, content);


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
		this.elements.root.appendChild(bottomDropZone);
		this.elements.root.appendChild(ModalButton.elements.root);
		this.elements.buttonModal = this.elements.root.querySelector(".acceptModal");

		console.log(ModalButton.elements.root);

		const onBlur = () => {
			const newContent = this.elements.input.textContent.trim();
			const newPriority = this.elements.select.value.trim();


			if (newContent == this.content && newPriority == this.priority) {
				return;
			}

			this.content = newContent;
			this.priority = newPriority;

			console.log("ENVIADO: "+id+" || "+this.content+" || "+{priority: this.priority});

			KanbanAPI.updateItem(id, {content: this.content}, {priority: this.priority});
		};

		this.elements.input.addEventListener("blur", onBlur);
		this.elements.select.addEventListener("blur", onBlur);
		this.elements.root.addEventListener("dblclick", () => {

				ModalButton.elements.root.classList.add('show');

			/*const check = confirm("Are you sure you want to delete this item?");

			if (check) {
				KanbanAPI.deleteItem(id);

				this.elements.input.removeEventListener("blur", onBlur);
				this.elements.root.parentElement.removeChild(this.elements.root);
			}*/
		});

		ModalButton.elements.root.addEventListener("click", event => {

			if ( event.target.className === "acceptModal" ){

				KanbanAPI.deleteItem(id);
				this.elements.input.removeEventListener("blur", onBlur);
				this.elements.root.parentElement.removeChild(this.elements.root);

				ModalButton.elements.root.classList.remove('show');			
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

			if ( event.target.className === "kanban__item-box" && (touchend - touchstart) < 500 ) {

				if ( this.elements.columMobile.style.display === "none" || this.elements.columMobile.style.display === "" )
					this.elements.columMobile.style.display = "block";	
				else 
					this.elements.columMobile.style.display = "none";

			}
			else if( (touchend - touchstart) > 500 ){ // Pulsacion larga

				ModalButton.elements.root.classList.add('show');

			}

			console.log(touchend - touchstart+" sec click");

		});


		/* Change column mobille start */ 

		this.elements.buttonColum1.addEventListener("click", () => {

			console.log("COL1");
			var colPos = KanbanAPI.getNumItemsCol(id,1);
			console.log("CP:"+colPos)

			KanbanAPI.updateItem(id,{
				columnId: 1,
				position: colPos
			});
			location.reload(true);			

		});

		this.elements.buttonColum2.addEventListener("click", event => {
			console.log("COL2 "+id);

			var colPos = KanbanAPI.getNumItemsCol(id,2);
			console.log("CP:"+colPos)

			KanbanAPI.updateItem(id,{
				columnId: 2,
				position: colPos
			});
			location.reload(true);
		});

		this.elements.buttonColum3.addEventListener("click", () => {

			console.log("COL3");
			var colPos = KanbanAPI.getNumItemsCol(id,3);
			console.log("CP:"+colPos)

			KanbanAPI.updateItem(id,{
				columnId: 3,
				position: colPos
			});
			location.reload(true);			

		});
		 /*Change column mobille end */




		/* ### START DESKTOP EVENTS ### */
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
					
				<div class="kanban__column-select">
					<button class="kanban__column-button button-1 col-md-3 col-lg-12 col-xl-3">Por Hacer</button>
					<button class="kanban__column-button button-2 col-md-3 col-lg-12 col-xl-3">Haciendo</button>
					<button class="kanban__column-button button-3 col-md-3 col-lg-12 col-xl-3">Hecho</button>
				</div>

			  </div>
			</div>
		`).children[0];
	}
}
