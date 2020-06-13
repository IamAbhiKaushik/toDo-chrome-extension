let changeColor = document.getElementById('changeColor');
let addButton = document.getElementById('addButton');
let inputElement = document.getElementById('inputElement');
let showTask = document.getElementById('showTask');

var text, todos=[], complete=[];
let images;


chrome.storage.sync.get('todos', function(data) {
  if (data.todos === null) {todos = ['New Tasks'];}
  else{todos = data.todos;}

  done = data.done;
  refreshPage();
});


function refreshPage(){
  text = "";
  for (i = 0; i < todos.length; i++) {
    appendToView(todos[i], i, false);
  }
  showTask.innerHTML = text;
  refreshImages();
}

function refreshImages(){
  deleteIcons = document.querySelectorAll('.markDelete'); 
  doneIcons = document.querySelectorAll('.markDone'); 

  deleteIcons.forEach(el => el.addEventListener('click', event => {
    triggerDelete(event.target.alt);
  }));

  doneIcons.forEach(el => el.addEventListener('click', event => {
    triggerDone(event.target.alt);
  }));


}

// todos value set to todo array 

addButton.onclick = function(element) {
  let value = inputElement.value;
  inputElement.value = "";
  updateTasks(value);
}

function updateTasks(value){
  todos.push(value);
  chrome.storage.sync.set({todos:todos}, function() {
      appendToView(value, todos.length-1);
      refreshImages();
  });
}

function appendToView(value, index, updateView=true){
    text += "<div class='task'>";
    text += "<p>" + value + "</p>";
    text += "<div class='right'>";
    text += "<img class='markDone' src='images/anydo.svg' alt='"+ index +"'>";
    text += "<img class='markDelete' src='images/delete.svg' alt='"+ index +"'></div>";
    text += "</div>";    
  if (updateView) {showTask.innerHTML = text;}
}

function triggerDelete(index) {
  if (todos.length>0){
    todos.splice(index, 1);
    chrome.storage.sync.set({todos:todos}, function() {
      refreshPage();
    });
  }
}

function triggerDone(index) {
  const value = todos[index];
  triggerDelete(index);
  done.push(value);
  chrome.storage.sync.set({done:done}, function() {
      console.log("added value" + value + "to Done");
  });

}

