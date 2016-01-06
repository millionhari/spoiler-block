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

      chrome.storage.local.set({'wordsList': updatedStorage});
    });
  }

  function _removeAllWordsFromListStorage(){
    for (var i = 0; i < blockedWords.children.length; i++){
      blockedWords.children[i].classList.add('animated', 'fadeOut');
    }
    setTimeout(function(){
      chrome.storage.local.set({'wordsList': {}});
    }, 500);
  }

  function _removeWordFromListStorage(word, listNode){
    listNode.classList.add('animated','fadeOut');
    setTimeout(function(){
      chrome.storage.local.get('wordsList', function(currentStorage){
        delete currentStorage.wordsList[word];
        chrome.storage.local.set({'wordsList':currentStorage.wordsList});
      });
    }, 500);
  }

  function _createIndividualBlockedItem(blockedWord){
    var listItem = document.createElement('li');
    listItem.innerText = blockedWord;
    listItem.dataset[blockedWord] = blockedWord;
    listItem.onclick = function(){
      _removeWordFromListStorage(blockedWord, listItem);
    };
    return listItem;
  }

  function _appendItemList(){
    chrome.storage.local.get('wordsList', function(response){
      var wordsList = response.wordsList;
      for (var i in wordsList){
        var li = _createIndividualBlockedItem(wordsList[i]);
        blockedWords.appendChild(li);
      }
    });
  }

  function _createBlockedListFromInputBox(){
    inputBoxWords = inputBox.value.replace(/\s\s+/g, ' ').replace(/[^\w\s]/gi, '')
.split(' ');
    if (inputBoxWords[inputBoxWords.length-1] === ''){
      inputBoxWords.pop();
    }
    if (inputBoxWords[0] === ''){
      inputBoxWords.shift();
    }
    var wordsBank = _wordsObjectCreator(inputBoxWords);
    _addToWordsListStorage(wordsBank);
    inputBox.value = '';
  }

  function init(){
    // On click or when 'add' button is pressed
    addButton.onclick = _createBlockedListFromInputBox;
    inputBox.onkeypress = function(evt){
      if (evt.charCode === 13){
        _createBlockedListFromInputBox();
      }
    };
    // Remove all
    removeButton.onclick = _removeAllWordsFromListStorage;
    // Add Blocked List Item
    _appendItemList();
    // Watch for changes
    chrome.storage.onChanged.addListener(function(){
      while (blockedWords.firstChild){
        blockedWords.removeChild(blockedWords.firstChild);
      }
      _appendItemList();
    });
  }

  return {
    init: init
  };

})();

Options.init();
