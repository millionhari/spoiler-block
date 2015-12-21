function createWordBank(arr){
  var obj = {};
  arr = arr.join('|-').split(' ').join('|-').split('|-');
  for (var i = 0; i < arr.length; i++){
    obj[arr[i].toLowerCase()] = arr[i].toLowerCase();
    if (arr[i][arr[i].length-1].toLowerCase() !== 's'){
      obj[arr[i].toLowerCase().concat('s')] = arr[i].toLowerCase().concat('s');
    }
  }
  return obj;
}

function blockStyle(node){
  node.style.backgroundColor = 'black';
  node.style.color = 'black';
}

function removePunctuations(str){
  var noPunctuationsStr = str.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g,"");
  noPunctuationsStr = noPunctuationsStr.replace(/\s{2,}/g," ");
  return noPunctuationsStr;
}

function htmlParser(str, wordBank){
  var noPunctuationsStr = removePunctuations(str.innerHTML);
  var words = noPunctuationsStr.split(' ');
  words.forEach(function(word){
    if (wordBank[word.toLowerCase()]){
      blockStyle(str);
    }
  });
}

function blocker(wordBank){
  var body = document.body.getElementsByTagName('*');
  var node;
  for (var i = 0; i < body.length; i++){
    if (body[i].children.length === 0){
      htmlParser(body[i], wordBank);
    }
  }
}


function init(wordList){
  var wordBank = createWordBank(wordList);
  blocker(wordBank);
}

init(['star wars', 'skywalker', 'solo', 'lightsaber']);
