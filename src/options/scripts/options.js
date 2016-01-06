var Options = (function(){
  var addButton = document.querySelector('.button-add');
  var blockedWords = document.querySelector('.blocked-words');
  var removeButton = document.querySelector('.button-remove');
  var inputBox = document.querySelector('.block-words');

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

  function _createIndividualBlockedItem(blockedWord){
    var listItem = document.createElement('li');
    listItem.innerText = blockedWord;
    listItem.dataset[blockedWord] = blockedWord;
    // blockedWord;
    listItem.onclick = function(){
      chrome.storage.local.get('wordsList', function(currentStorage){
        delete currentStorage.wordsList[blockedWord];
        chrome.storage.local.set({'wordsList':currentStorage.wordsList});
      });
    };
    return listItem;
  }

  function _createItemMaker(){
    chrome.storage.local.get('wordsList', function(response){
      var wordsList = response.wordsList;
      for (var i in wordsList){
        var li = _createIndividualBlockedItem(wordsList[i]);
        blockedWords.appendChild(li);
      }
    });
  }

  function _grabTextFromInputBox(){
    inputBoxWords = inputBox.value.replace(/\s\s+/g, ' ').split(' ');
    if (inputBoxWords[inputBoxWords.length-1] === ''){
      inputBoxWords.pop();
    }
    var wordsBank = _wordsObjectCreator(inputBoxWords);
    _addToWordsListStorage(wordsBank);
    inputBox.value = '';
  }

  function init(){
    addButton.onclick = _grabTextFromInputBox;
    inputBox.onkeypress = function(evt){
      if (evt.charCode === 13){
        _grabTextFromInputBox();
      }
    };

    removeButton.onclick = _removeAllWordsFromListStorage;


    _createItemMaker();
  }

  return {
    init: init
  };

})();

Options.init();
