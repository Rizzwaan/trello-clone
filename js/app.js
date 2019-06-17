const API_KEY = 'ac4773e34a378d95c6e50ebea683ea95';
const TOKEN = 'a6cff7f4e6688a3b4a6655dfc07addf4a0601cad58a40e7cdd95ace8b4635b17';
const BOARD_ID = 'ZfeVzAkr';

//----------------------------------------------------------------------------------//
//UI Elements



//----------------------------------------------------------------------------------//

const getSpecificList = (listObj) => {
  return listObj[1]["id"];
} 


const getListFromBoard = (apiKey, token, boardId) => {
   return fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`)
   .then(response => response.json())
   .then(listObj => getSpecificList(listObj));
} 
//-----------------------------------------------------------------------------------//
const getCardIdsOfList = (apiKey,token,listIdOfBoard) => {
  return listIdOfBoard.then((id) => {
      return fetch(`https://api.trello.com/1/lists/${id}/cards?key=${apiKey}&token=${token}`)
               .then((response) => response.json())
                  .then((data) => data.map(v => v["id"]));  
   })  
};

//----------------------------------------------------------------------------------//

const getAllChecklistIds = (apiKey,token,cardId) => {
   
   return fetch(
      `https://api.trello.com/1/cards/${cardId}/checklists?key=${apiKey}&token=${token}`
      )
        .then((response) => response.json())
           .then((data) => data.map(v => v["id"]));
  
};

const getCheckListIdOfCards = (apiKey,token, cardIdsOfList) => {
   return cardIdsOfList.then((idArray) => {
       return  Promise.all(idArray.map(cardId => getAllChecklistIds(apiKey,token,cardId)));                
   })
}

//------------------------------------------------------------------------------------//


const getCheckItemsIds = ( apiKey, token, idEach) => {
   return fetch(`https://api.trello.com/1/checklists/${idEach}/checkItems?key=${apiKey}&token=${token}`).then((response) => response.json()).then(checkIdData => Promise.all( checkIdData));
} 

const getCheckItemIdsOfChecklists = (apiKey, token,  flatedArr) => {
  // console.log(flatedArr);
    return Promise.all(flatedArr.map(idEach => getCheckItemsIds(apiKey,token, idEach)));
 
}

//-------------------------------------------------------------------------------//
const createToDoItem = (item) => {
  
   let divEach = document.createElement('div');
   divEach.className = 'todo-items';

   let checkBoxDiv = document.createElement('div');
   checkBoxDiv.className = 'todo-check';

   let checkBox = document.createElement('input');
   checkBox.setAttribute('type','checkbox');

   checkBoxDiv.appendChild(checkBox);
    
   let todoTextDiv = document.createElement('div');
    todoTextDiv.className = 'todo-text-item';

   let todoText = document.createElement('p');
     todoText.className = "text-item";
   let checkText = document.createTextNode(`${item["name"]}`);
     todoText.appendChild(checkText);  
     todoTextDiv.appendChild(todoText);
   
   let todoCrossDiv = document.createElement('div');
     todoCrossDiv.className = 'text-cross'
   
   let crossIcon = document.createElement('i');
   crossIcon.classList.add('material-icons','close');
   
   todoCrossDiv.appendChild(crossIcon);
     
     divEach.appendChild(checkBoxDiv);
     divEach.appendChild(todoTextDiv);
     divEach.appendChild(todoCrossDiv);

    return divEach;
} 
//-------------------------------------------------------------------------------//
const uiCheckItemsName = (checkItems) => {
   let todoDiv_UI = document.querySelector('#todos');
   checkItems.map(item => {
      let eachCheckItem = createToDoItem(item);
       todoDiv_UI.appendChild(eachCheckItem);
   })
   
    
}


//-------------------------------------------------------------------------------//
 const generateToDoItems = (checkItems) => {
   
     const todoItem  = uiCheckItemsName(checkItems); 
 }


//----------------------------------------------------------------------------------//
const controller = (apiKey,token,boardId) => {
   const listIdOfBoard = getListFromBoard(apiKey,token, boardId);
   const cardIdsOfList = getCardIdsOfList(apiKey,token,listIdOfBoard);
   const checkListsIds = getCheckListIdOfCards(apiKey,token,cardIdsOfList);
   const checkItemsEach = checkListsIds.then(idArr => {
      let flatedArr = idArr.flat();
      return getCheckItemIdsOfChecklists(apiKey,token, flatedArr)
   }) ;
   const toDoItem = checkItemsEach.then(item => {
      let checkItems = item.flat();
     // console.log(checkItems)
      return generateToDoItems(checkItems)
   })
   //console.log(checkItemsEach.then(v => console.log(v)));
          
  
}

controller(API_KEY, TOKEN, BOARD_ID);