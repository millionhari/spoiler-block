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

  function _htmlParser(str, wordBank){
    // TODO: MAKE FUNCTION READ EVERY X WORD
    var words = str.innerHTML.split(' ');
    var specialCharacter = new RegExp(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g);

    _jumpX(words, 2, function(word){
      word = word.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      // console.log(word);
      // If last character is a special character
      if (specialCharacter.test(word[word.length-1])){
        word = word.slice(0,word.length-1);
      }
      if (wordBank[word.toLowerCase()]){
        _blockStyle(str);
      }
    });

    // words.forEach(function(word){
    //   word = word.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    //   console.log(word);
    //   // If last character is a special character
    //   if (specialCharacter.test(word[word.length-1])){
    //     word = word.slice(0,word.length-1);
    //   }
    //   if (wordBank[word.toLowerCase()]){
    //     _blockStyle(str);
    //   }
    // });
  }

  function _blocker(wordBank){
    var body = document.body.getElementsByTagName('*');
    var node;
    for (var i = 0; i < body.length; i++){
      if (body[i].children.length === 0){
        _htmlParser(body[i], wordBank);
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
    var sum = 0;
    var observer = new MutationObserver(function(mutations){
        callback();
        console.log(sum);
        sum++;
    });

    var config = {attributes:true, childList:true, characterData:true};

    observer.observe(target, config);
  }


  return {
    init: init,
    watchForDOMChanges: watchForDOMChanges
  };

})();



SpoilerBlock.init();
SpoilerBlock.watchForDOMChanges(SpoilerBlock.init);
