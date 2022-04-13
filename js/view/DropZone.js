import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
	static createDropZone() {
		const range = document.createRange();

		range.selectNode(document.body);

		const dropZone = range.createContextualFragment(`
			<div class="kanban__dropzone"></div>
		`).children[0];

		dropZone.addEventListener("dragover", e => {
			e.preventDefault();
			dropZone.classList.add("kanban__dropzone--active");
		});

/*
		dropZone.addEventListener("touchmove", e => {
			e.preventDefault();
			dropZone.classList.add("kanban__dropzone--active");
		});*/		

		dropZone.addEventListener("dragleave", () => {
			dropZone.classList.remove("kanban__dropzone--active");
		});

		dropZone.addEventListener("drop", e => {
			e.preventDefault();
			dropZone.classList.remove("kanban__dropzone--active");

			const columnElement = dropZone.closest(".kanban__column");
			const columnId = Number(columnElement.dataset.id);
			const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
			const droppedIndex = dropZonesInColumn.indexOf(dropZone);
			const itemId = Number(e.dataTransfer.getData("text/plain"));
			const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
			const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;



			if (droppedItemElement.contains(dropZone)) {
				return;
			}
			debugger;
			console.log(dropZone.parentElement.classList.contains("kanban__item"));
			console.log(dropZone);
			console.log("Dropzone: "+itemId+" || "+columnId+" || "+droppedIndex);
			insertAfter.after(droppedItemElement);
			KanbanAPI.updateItem(itemId, {
				columnId,
				position: droppedIndex
			});
		});

		return dropZone;
	}


	static changeColumn(itemId){

		console.log("CC");
		this.dz = {};
		this.dz = DropZone.createDropZone();
		console.log(this.dz);
		const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);	
		console.log(this.dz.parentElement);		
		//const insertAfter = this.dz.parentElement.classList.contains("kanban__item") ? this.dz.parentElement : this.dz;

		if (droppedItemElement.contains(dz)) {
		return;
		}

		insertAfter.after(droppedItemElement);		

	}


}
