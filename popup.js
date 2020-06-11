let changeColor = document.getElementById('changeColor');
let addButton = document.getElementById('addButton');
let inputElement = document.getElementById('inputElement');
let showTask = document.getElementById('showTask');

  chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    console.log(data.color)
    changeColor.setAttribute('value', data.color);
  });

  chrome.storage.sync.get('records', function(data) {
    
    if (data.records.length > 0) {
      console.log(data.records);
    }
    else {
      data.records = ['Sample Task'];
    }
    showTask.innerHTML = data.records.toString();
  });


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
    console.log(value);

    chrome.storage.sync.get({
    records:[] //setting an empty default value
    },
    function(data) {
       console.log(data.records);
       update(data.records, value); //storing the storage value in a variable and passing to update function
    }
    );  
    // chrome.storage.sync.set('color', function(data) {
    //   changeColor.style.backgroundColor = data.color;
    //   changeColor.setAttribute('value', data.color);
    // });
  }

  function update(array, value)
   {
    array.push(value);
    //then call the set to update with modified value
    chrome.storage.sync.set({records:array}, function() {
        console.log(array);
    });
    }
