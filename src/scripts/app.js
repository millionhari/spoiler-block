var SpoilerBlock = (function(){
  function _createWordBank(arr){
    var obj = {};
    var specialCharacter = new RegExp(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g);
    var mutatedWord;
    arr = arr.join('|-').split(' ').join('|-').split('|-');
    for (var i = 0; i < arr.length; i++){
      // register lowercase word
      obj[arr[i].toLowerCase()] = arr[i].toLowerCase();

      // register plural 's' form of word
      if (arr[i][arr[i].length-1].toLowerCase() !== 's'){
        mutatedWord = arr[i].toLowerCase().concat('s');
        obj[mutatedWord] = mutatedWord;
      }

      // register possessive 'ed' form of word
      if (arr[i].slice(arr[i].length-2, arr[i].length).toLowerCase() !== 'ed'){
        mutatedWord = arr[i].toLowerCase().concat('ed');
        obj[mutatedWord] = mutatedWord;
      }

      // register punctuationless form of word
      if (specialCharacter.test(arr[i])){
        mutatedWord = arr[i].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        obj[mutatedWord] = mutatedWord;
      }
    }
    return obj;
  }

  function _blockStyle(node){
    if (node.parentNode !== document.body){
      node.parentNode.classList.add('spoiler-block-censored');
    } else {
      node.classList.add('spoiler-block-censored');
    }
  }

  // Account for possessive and hypens
  function _htmlParser(str, wordBank){
    var words = str.innerHTML.split(' ');
    var specialCharacter = new RegExp(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g);

    words.forEach(function(word){
      // If last character is a special character
      if (specialCharacter.test(word[word.length-1])){
        word = word.slice(0,word.length-1);
      }
      if (wordBank[word.toLowerCase()]){
        _blockStyle(str);
      }
    });
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


  function init(wordList){
    var port = chrome.runtime.connect({name:'spoilerblock'});
    port.postMessage({question:'What is the block list?'});
    port.onMessage.addListener(function(response){
      var wordsList = response.blockList;
      console.log(wordsList);
    });

    var wordBank = _createWordBank(wordList);
    _blocker(wordBank);
  }


  return {
    init: init
  };

})();



SpoilerBlock.init(['rebellion', 'death star', 'science fantasy', 'galactic war', 'empire', 'princess', 'droid', 'jedi', 'lightsaber', 'millennium falcon', 'duel', 'sword duel', 'jedi knight', 'smuggler', 'mind trick', 'stormtrooper', 'force', 'space war', 'extraterrestrial']);
