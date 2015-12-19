function createWordBank(arr){
  var obj = {};
  arr = arr.join('|-').split(' ').join('|-').split('|-');
  for (var i = 0; i < arr.length; i++){
    obj[arr[i].toLowerCase()] = arr[i].toLowerCase();
  }
  return obj;
}

function blockStyle(node){
  node.style.backgroundColor = 'black';
  node.style.color = 'black';
}

function htmlParser(str, wordBank){
  var words = str.innerHTML.split(' ');
  words.forEach(function(word){
    if (wordBank[word.toLowerCase()]){
      blockStyle(str);
    }
  });
}

function blocker(wordBank){
  // {star wars: "star wars", han solo: "han solo", skywalker: "skywalker"}
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

init(['star wars', 'han solo', 'skywalker']);

// element.style.backgroundColor = 'black';
// element.style.color = 'black';

// for (var i =0; i < body.length; i++){
  // body[i].style.backgroundColor = 'black';
  // body[i].style.color = 'black'
// }
