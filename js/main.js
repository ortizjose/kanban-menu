import Kanban from "./view/Kanban.js";

new Kanban(
	document.querySelector(".kanban")
);


const priorityButtons = document.getElementsByClassName('kanban__item-priority');
for ( let i of priorityButtons){
  i.addEventListener('change', (event) =>{

  	//console.log(i.value);
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