(function(){
  var addButton = document.querySelector('.button-add');
  var _wordsObjectCreator = function(arr){
    var obj = {};
    for (var i = 0; i < arr.length; i++){
      obj[arr[i]] = arr[i];
    }
    return obj;
  };

  var _flattenObj = function(obj){
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
  };

  var _combineObjects = function(currentObj, newObj){
    for (var i in newObj){
      currentObj[i] = newObj[i];
    }
    currentObj = _flattenObj(currentObj);
    return currentObj;
  };

  var _addToWordsListStorage = function(wordsBankObj){
    chrome.storage.sync.get('wordsList', function(currentStorage){
      var updatedStorage = _combineObjects(currentStorage, wordsBankObj);

      chrome.storage.sync.set({'wordsList': updatedStorage}, function(){
        console.log('The storage has been updated!', updatedStorage);
      });
    });
  };

  addButton.onclick = function(){
    var inputBox = document.querySelector('.block-words').value.split(' ');
    var wordsBank = _wordsObjectCreator(inputBox);

    _addToWordsListStorage(wordsBank);
  };
})();
