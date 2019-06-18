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
     .then(listObj => getSpecificList(listObj))
       .catch((err) => console.log(`List Id Not found ${err}`));
} 
//-----------------------------------------------------------------------------------//
const getCardIdsOfList = (apiKey,token,listIdOfBoard) => {
   
      return fetch(`https://api.trello.com/1/lists/${listIdOfBoard}/cards?key=${apiKey}& token=${token}`)
               .then((response) => response.json())
                  .then((data) => data.map(v => v["id"]))
                     .catch((err) => console.log(`Card Id Not found ${err}`));  
  
};

//----------------------------------------------------------------------------------//

const getAllChecklistIds = (apiKey,token,cardId) => {
   
   return fetch(
      `https://api.trello.com/1/cards/${cardId}/checklists?key=${apiKey}&token=${token}`
      )
        .then((response) => response.json())
           .then((data) => data.map(v => v["id"]))
              .catch((err) => console.log(`ChecckList Id Not found ${err}`));
};

const getCheckListIdOfCards = (apiKey,token, cardIdsOfList) => { 
   return Promise.all(cardIdsOfList.map(cardId => getAllChecklistIds(apiKey,token,cardId)));
}

//------------------------------------------------------------------------------------//


const getCheckItemsIds = ( apiKey, token, idEach) => {
   return fetch(`https://api.trello.com/1/checklists/${idEach}/checkItems?key=${apiKey}&token=${token}`).then((response) => response.json());
} 

const getCheckItemIdsOfChecklists = (apiKey, token,  flatedArr) => {
  // console.log(flatedArr);
    return Promise.all(flatedArr.map(idEach => getCheckItemsIds(apiKey,token, idEach)));
 
}

//-------------------------------------------------------------------------------//
const createToDoItem = (item) => {  
   let divEach = document.createElement('div');
    divEach.className = 'todo-items'; 
    let eachElement = ` <div class="todo-check">
                     <input type="checkbox">
                   </div>                 
                  <div class="todo-text-item">
                    <p class="text-item">${item["name"]}</p>
                   </div>
                   <div class="todo-delete">
                     <a href="#" 
                      class="link-delete-item">
                      <i class="fas fa-times-circle"
                      data-checkItemId = ${item["id"]}
                      data-checkListId = ${item["idChecklist"]}
                      data-state = ${item["state"]}
                      ></i></a>
                   </div>
                    `;
     divEach.innerHTML = eachElement;
      
     return divEach;
} 
//-------------------------------------------------------------------------------//
const getUiCheckItemsName = (checkItems) => {
   let todoDiv_UI = document.querySelector('#todos');
   checkItems.map(item => {
      let eachCheckItem = createToDoItem(item);
       todoDiv_UI.appendChild(eachCheckItem);
   }) 
}


//-------------------------------------------------------------------------------//
 


//----------------------------------------------------------------------------------//
const  deleteRequestFunction = ( e ) => {
  if( e.target.className === ("fas fa-times-circle")  ){
     let checkItemId = e.target.dataset.checkitemid;
     let checkListId = e.target.dataset.checklistid;
    // console.log(checkItemId);
     fetch(`https://api.trello.com/1/checklists/${checkListId}/checkItems/${checkItemId}?key=${API_KEY}&token=${TOKEN}`,{method: 'DELETE'}).then(response => response.json())
     .then(data =>  {
         e.target.parentElement.parentElement.parentElement.remove();
     });      
  }
}


const deleteTodos = (todoItem,apiKey,token) => {
   let closeBtn = document.querySelector("#todos");
    closeBtn.addEventListener('click', deleteRequestFunction);
   
}




//----------------------------------------------------------------------------------//
const controller = (apiKey,token,boardId) => {
   const listIdOfBoard = getListFromBoard(apiKey,token, boardId);
   const cardIdsOfList = listIdOfBoard.then((listID) => {
      return getCardIdsOfList(apiKey,token,listID)
   });
   const checkListsIds = cardIdsOfList.then((cardId) => {
       return getCheckListIdOfCards(apiKey,token,cardId);
   })
   const checkItemsEach = checkListsIds.then(idArr => {
      let flatedArr = idArr.flat();
      return getCheckItemIdsOfChecklists(apiKey,token, flatedArr)
   }) ;
   const toDoItem = checkItemsEach.then(item => {
      let checkItems = item.flat();
      
      getUiCheckItemsName(checkItems);
       deleteTodos(checkItems,apiKey,token);
   })
   
  
}

controller(API_KEY, TOKEN, BOARD_ID);