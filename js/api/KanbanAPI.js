export default class KanbanAPI {
	static getItems(columnId) {
		const column = read().find(column => column.id == columnId);

		if (!column) {
			return [];
		}

		return column.items;
	}

	static insertItem(columnId, content) {
		const data = read();
		const column = data.find(column => column.id == columnId);
		const item = {
			id: Math.floor(Math.random() * 100000),
			content,
			priority: 0
		};

		if (!column) {
			throw new Error("Column does not exist.");
		}

		column.items.push(item);
		save(data);

		return item;
	}

	static updateItem(itemId, newProps, newPriority) {

		const data = read();
		const [item, currentColumn] = (() => {
			for (const column of data) {
				const item = column.items.find(item => item.id == itemId);

				if (item) {
					return [item, column];
				}
			}
		})();

		if (!item) {
			throw new Error("Item not found.");
		}
		//debugger;
		item.content = newProps.content === undefined ? item.content : newProps.content;

		if (newPriority != null ){
			item.priority = newPriority.priority; 
		}

		// Update column and position
		if (
			newProps.columnId !== undefined
			&& newProps.position !== undefined
		) {
			const targetColumn = data.find(column => column.id == newProps.columnId);

			if (!targetColumn) {
				throw new Error("Target column not found.");
			}

			// Delete the item from it's current column
			currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

			// Move item into it's new column and position
			targetColumn.items.splice(newProps.position, 0, item);
		}

		save(data);
		console.log(data);
	}

	static deleteItem(itemId) {
		const data = read();

		for (const column of data) {
			const item = column.items.find(item => item.id == itemId);

			if (item) {
				column.items.splice(column.items.indexOf(item), 1);
			}
		}

		save(data);
	}

	static getNumItemsCol(itemId, colId) {
		const data = read();

		for (const column of data) {
			if (column.id === colId)
				return column.items.length;
		}

	}

	static cambioColor(priorityButtons) {

	  for ( let i of priorityButtons){

	  //AL CARGAR LA PAG
	  switch(i.value){
	    case '-1':
	      i.style.background = "linear-gradient(to right, #393e46 50%, #67696B )";
	       break;
	    case '0':
	      i.style.background = "linear-gradient(to right, #2563eb 60%, #60a5fa )";    
	       break;
	    case '1':
	      i.style.background = "linear-gradient(to right, #059669 50%, #34d399 )";    
	       break;
	    case '2':
	      i.style.background = "linear-gradient(to right, #D9433F 50%, #FA7A76 )";    
	       break;            
	  }

	  i.addEventListener('change', (event) =>{  

	    switch(i.value){
	      case '-1':
	        i.style.background = "linear-gradient(to right, #393e46 50%, #67696B )";
	         break;
	      case '0':
	        i.style.background = "linear-gradient(to right, #2563eb 60%, #60a5fa )";    
	         break;
	      case '1':
	        i.style.background = "linear-gradient(to right, #059669 50%, #34d399 )";    
	         break;
	      case '2':
	        i.style.background = "linear-gradient(to right, #D9433F 50%, #FA7A76 )";    
	         break;            
	    }

	    });
	  }
	}


}

function read() {
	const json = localStorage.getItem("kanban-data");

	if (!json) {
		return [
			{
				id: 1,
				items: []
			},
			{
				id: 2,
				items: []
			},
			{
				id: 3,
				items: []
			},
		];
	}

	return JSON.parse(json);
}

function save(data) {
	localStorage.setItem("kanban-data", JSON.stringify(data));
}


