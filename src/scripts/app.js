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

      // register punctuationless form of word
      if (specialCharacter.test(obj[i])){
        mutatedWord = obj[i].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
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


  function init(){
    var port = chrome.runtime.connect({name:'spoilerblock'});
    port.postMessage({question:'What is the block list?'});
    port.onMessage.addListener(function(response){
      var wordsList = response.blockList.wordsList;
      var wordBank = _createWordBank(wordsList);
      _blocker(wordBank);
    });
  }


  return {
    init: init
  };

})();



SpoilerBlock.init();
