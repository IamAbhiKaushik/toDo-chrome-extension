let changeColor = document.getElementById('changeColor');
let addButton = document.getElementById('addButton');
let inputElement = document.getElementById('inputElement');
let showTask = document.getElementById('showTask');
var text;
var records=[];

  chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    console.log(data.color)
    changeColor.setAttribute('value', data.color);
  });
  updateContent();

  changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
  };

  addButton.onclick = function(element) {
    let value = inputElement.value;
    inputElement.value = "";
    update(value);
  }

  function update(value){
    records.push(value);
    chrome.storage.sync.set({records:records}, function() {
        console.log(records);
    });
    updateContent();
  }

  function updateContent(){
    text = "";
    if (records.length==0){
      chrome.storage.sync.get('records', function(data) {
        if (data.records.length == 0) {
        records = ['New Tasks'];
        }
        else{
          records = data.records;
        }
      });
    }

    for (i = 0; i < records.length; i++) {
      text += "<div class='task'>";
      text += "<p>" + records[i] + "</p>";
      text += "<div class='right'><img src='images/anydo.svg' alt='"+ i +"'>";
      text += "<img src='images/delete.svg' alt='"+"X:"+i +"'></div>";
      text += "</div>";
    }
    showTask.innerHTML = text;
    
    var all_images, image_index;
    all_images = document.querySelectorAll("img");
    for (image_index = 0; image_index < all_images.length; image_index++) {
      all_images[image_index].addEventListener("click", function(){
        alt_text = this.alt;
        perform_task(alt_text);
      });
    }
  }

  function perform_task(alt_text){
    if (alt_text[0] == "X"){
      delete_task_from_data()
    }
    else{
      mark_task_as_done()
    }
    updateContent()
    addButton.innerHTML = alt_text;
  }
