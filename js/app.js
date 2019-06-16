const API_KEY = 'ac4773e34a378d95c6e50ebea683ea95';
const TOKEN = 'a6cff7f4e6688a3b4a6655dfc07addf4a0601cad58a40e7cdd95ace8b4635b17';
const BOARD_ID = 'ZfeVzAkr'
 

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
const checkItemId = (apiKey,token, d) => {
   
    return fetch(`https://api.trello.com/1/checklists/${d}/checkItems?key=${apiKey}&token=${token}`).then((response) => response.json()).then((data) => console.log(data))
      
};


const getIds = (apiKey,token, v ) => {
   v.map(d => checkItemId(apiKey, token, d));
};

const getCheckItemIdsOfChecklists = (apiKey, token, checkListsIds) => {
   checkListsIds.then(data => data.map(v => getIds(apiKey,token,v)));
}

const controller = (apiKey,token,boardId) => {
   const listIdOfBoard = getListFromBoard(apiKey,token, boardId);
   const cardIdsOfList = getCardIdsOfList(apiKey,token,listIdOfBoard);
   const checkListsIds = getCheckListIdOfCards(apiKey,token,cardIdsOfList);
   const checkItemsIds = getCheckItemIdsOfChecklists(apiKey,token, checkListsIds); 
   //console.log(checkListsIds.then(data => console.log(data)));
}

controller(API_KEY, TOKEN, BOARD_ID);