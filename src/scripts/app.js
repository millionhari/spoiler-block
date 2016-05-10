var SpoilerBlock = (function(){

  function _createWordBank(obj){
    var wordBank = {};
    var specialCharacter = new RegExp(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g);
    var mutatedWord;
    for (var i in obj){
      // register lowercase word
      wordBank[obj[i].toLowerCase()] = obj[i].toLowerCase();

      // register plural 's' form of word
      if (obj[i][obj[i].length-1].toLowerCase() !== 's'){
        mutatedWord = obj[i].toLowerCase().concat('s');
        wordBank[mutatedWord] = mutatedWord;
      }

      // register possessive 'ed' form of word
      if (obj[i].slice(obj[i].length-2, obj[i].length).toLowerCase() !== 'ed'){
        mutatedWord = obj[i].toLowerCase().concat('ed');
        wordBank[mutatedWord] = mutatedWord;
      }
    }
    return wordBank;
  }

  function _blockStyle(node){
    if (node.parentNode !== document.body){
      node.classList.add('spoiler-block-censored');
      node.parentNode.classList.add('spoiler-block-censored');
    } else {
      node.classList.add('spoiler-block-censored');
    }
  }

  function _jumpX(arr, jump, callback){
    var combined = [];
    var currentNum = 0;
    for (var i = 0; i < arr.length; i++){
      while (currentNum<jump){
        if (arr[i+currentNum] === arr[arr.length]){return;}
        combined.push(arr[i+currentNum]);
        currentNum++;
      }
      var combinedWord = combined.join(' ').toLowerCase();
      callback(combinedWord);
      currentNum = 0;
      combined = [];
    }
  }

  function _htmlParser(str, wordBank, wordCount){
    var words = str.innerHTML.split(' ');
    var specialCharacter = new RegExp(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g);

    var blockDiv = function(word){
      word = word.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

      // If last character is a special character
      if (specialCharacter.test(word[word.length-1])){
        word = word.slice(0,word.length-1);
      }
      if (wordBank[word]){
        _blockStyle(str);
      }
    };

    // Parse through HTML and account for spaces
    for (var i = 0; i < wordCount.length; i++){
      _jumpX(words, wordCount[i], blockDiv);
    }
  }

  function _numberOfWordsInObj(obj){
    var wordCountObj = {};
    var wordCount = [];
    for (var i in obj){
      wordCountObj[obj[i].split(' ').length] = obj[i].split(' ').length;
    }
    for (var j in wordCountObj){
      wordCount.push(wordCountObj[j]);
    }
    return wordCount;
  }

  function _blocker(wordBank){
    var body = document.body.getElementsByTagName('*');
    var wordCount = _numberOfWordsInObj(wordBank);
    for (var i = 0; i < body.length; i++){
      if (body[i].children.length === 0){
        _htmlParser(body[i], wordBank, wordCount);
      }
    }
  }

  function init(){
    var port = chrome.runtime.connect({name:'spoilerblock'});
    port.postMessage({question:'What is the block list?'});
    port.onMessage.addListener(function(response){
      var wordsList = response.blockList.wordsList;
      var wordBank = _createWordBank(wordsList);
      _blocker(wordBank);
    });
  }

  function watchForDOMChanges(callback){
    var target = document.body;
    var observer = new MutationObserver(function(mutations){
        mutations.forEach(function(){
          console.log(mutations);
          callback();
        })
    });

    var config = {attributes:true, childList:true, characterData:true};

    observer.observe(target, config);
  }

  var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
      eventListenerSupported = window.addEventListener;

    return function(obj, callback){
      if( MutationObserver ){
        // define a new observer
        var obs = new MutationObserver(function(mutations, observer){
          if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
            callback();
        });
        // have the observer observe foo for changes in children
        obs.observe( obj, { childList:true, subtree:true });
      }
      else if( eventListenerSupported ){
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    }
  })();

  // Observe a specific DOM element:
  observeDOM( document.getElementsByTagName('body')[0],init);


  // TODO: Add support to block anagrams
  /*
  // function _findAllPermutations(str, index, buffer) {
  //   if (typeof str == "string")
  //       str = str.split("");
  //   if (typeof index == "undefined")
  //       index = 0;
  //   if (typeof buffer == "undefined")
  //       buffer = [];
  //   if (index >= str.length)
  //       return buffer;
  //   for (var i = index; i < str.length; i++)
  //       buffer.push(_toggleLetters(str, index, i));
  //   return _findAllPermutations(str, index + 1, buffer);
  // }

  // function _toggleLetters(str, index1, index2) {
  //   if (index1 != index2) {
  //       var temp = str[index1];
  //       str[index1] = str[index2];
  //       str[index2] = temp;
  //   }
  //   return str.join("");
  // }

  // function WriteLine(msg) {
  //   console.log(msg);
  // }

  // WriteLine(_findAllPermutations("star wars"));
  */


  return {
    init: init,
    watchForDOMChanges: watchForDOMChanges
  };

})();



SpoilerBlock.init();

