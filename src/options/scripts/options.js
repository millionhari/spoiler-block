var Options = (function(){
  var addButton = document.querySelector('.button-add');
  var blockedWords = document.querySelector('.blocked-words');
  var removeButton = document.querySelector('.button-remove');
  var inputBox = document.querySelector('.block-words');
  var ignoreWords = {
    the: 'the',
    of: 'of',
    to: 'to',
    and: 'and',
    a: 'a',
    in: 'in',
    is: 'is',
    it: 'it',
    you: 'you',
    that: 'that',
    he: 'he',
    was: 'was',
    for: 'for',
    on: 'on',
    are: 'are',
    with: 'with',
    as: 'as',
    i: 'i',
    his: 'his',
    they: 'they',
    be: 'be',
    at: 'at',
    have: 'have',
    this: 'this',
    from: 'from',
    or: 'or',
    had: 'had',
    by: 'by',
    but: 'but',
    some: 'some',
    what: 'what',
    there: 'there',
    we: 'we',
    were: 'were',
    all: 'all',
    your: 'your',
    an: 'an',
    she: 'she',
    do: 'do',
    their: 'their',
    if: 'if',
    so: 'so'
  };

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
      if (!ignoreWords[newObj[i]]){
        currentObj[i] = newObj[i];
      }
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

    // Set data attribute
    var dataSetBlockedWord = blockedWord.replace(/\s+/g,'');
    listItem.dataset[dataSetBlockedWord] = dataSetBlockedWord;

    // Set onclick
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

  function _filterAndConvertToArray(inputBox){
    var removeSpaces = inputBox.value.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '').replace(/\s+/g,' ').replace(/\s/g,' ').replace(/,\s/g,',').replace(/^\s+|\s+$/g, "").split(',');

    for (var i = 0; i < removeSpaces.length; i++){
      if (removeSpaces[i][removeSpaces[i].length-1] === ' '){
        removeSpaces[i] = removeSpaces[i].slice(0,removeSpaces[i].length-2);
      }
    }

    return removeSpaces;
  }

  function _createBlockedListFromInputBox(){
    var inputBoxWords = _filterAndConvertToArray(inputBox);
    console.log(inputBoxWords);

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

    // Temporary Blocked
    // buttonLog.onclick = function(){
    //   chrome.storage.local.get('wordsList', function(x){
    //     console.log(x);
    //   });
    // };

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
