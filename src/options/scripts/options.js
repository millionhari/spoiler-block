var Options = (function(){
  var addButton = document.querySelector('.button-add');
  var blockedWords = document.querySelector('.blocked-words');
  var removeButton = document.querySelector('.button-remove');

  function _wordsObjectCreator(arr){
    var obj = {};
    for (var i = 0; i < arr.length; i++){
      obj[arr[i]] = arr[i];
    }
    return obj;
  }

  function _flattenObj(obj){
    var finalObj = {};
    var recurse = function(element){
      for (var i in element){
        if (typeof element[i] === 'object' && element !== null){
          recurse(element[i]);
        } else {
          finalObj[i] = element[i];
        }
      }
      return;
    };
    recurse(obj);
    return finalObj;
  }

  function _combineObjects(currentObj, newObj){
    for (var i in newObj){
      currentObj[i] = newObj[i];
    }
    currentObj = _flattenObj(currentObj);
    return currentObj;
  }

  function _addToWordsListStorage(wordsBankObj){
    chrome.storage.local.get('wordsList', function(currentStorage){
      var updatedStorage = _combineObjects(currentStorage, wordsBankObj);

      chrome.storage.local.set({'wordsList': updatedStorage}, function(){
        console.log('The following words have been added', wordsBankObj);
      });
    });
  }

  // TODO: Finish remove words from storage function
  function _removeAllWordsFromListStorage(){
    chrome.storage.local.set({'wordsList': {}}, function(){
      console.log('emptied!');
    });
  }

  function _removeWordFromListStorage(str){
    chrome.storage.local.get('wordsList', function(response){
      var wordsList = response.wordsList;
      console.log(wordsList);
    });
  }

  function _createItemMaker(){
    chrome.storage.local.get('wordsList', function(response){
      var wordsList = response.wordsList;
      for (var i in wordsList){
        var li = document.createElement('li');
        li.innerText = wordsList[i];
        li.dataset[i] = i;
        blockedWords.appendChild(li);
      }
    });
  }

  function init(){
    addButton.onclick = function(){
      var inputBox = document.querySelector('.block-words').value.replace(/\s\s+/g, ' ').split(' ');
      if (inputBox[inputBox.length-1] === ''){
        inputBox.pop();
      }
      var wordsBank = _wordsObjectCreator(inputBox);

      _addToWordsListStorage(wordsBank);
    };

    removeButton.onclick = _removeAllWordsFromListStorage;

    _createItemMaker();
  }

  return {
    init: init
  };

})();

Options.init();
