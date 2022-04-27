export default class Modal {
	constructor(itemId, itemContent) {		
		console.log("MODAL CREATE");

		this.elements = {};
		this.elements.root = Modal.createRoot(itemId,itemContent);
		this.elements.CloseButton = this.elements.root.querySelector(".closeModal");
		this.elements.AcceptButton = this.elements.root.querySelector(".acceptModal");

		this.elements.CloseButton.addEventListener("click", () => {
				this.elements.root.classList.remove('show');
		});	

		this.elements.AcceptButton.addEventListener("click", e => {
		e.preventDefault();		
	

		});



	}
	static createRoot(itemId, itemContent) {

		const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
		<div class="kanban__modal-back" id="modal-`+itemId+`">
		  <div class="kanban__modal-content">
		    <h1>¿Desea borrar el elemento?</h1>
		    <p> El elemento "`+itemContent+`" va a proceder a eliminarse del panel.</p>
		    <button class="closeModal">Rechazar</button>
		    <button class="acceptModal">Aceptar</button>
		  </div>
		`).children[0];
	}


}
