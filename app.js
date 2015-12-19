function createWordBank(arr){
  var obj = {};
  for (var i = 0; i < arr.length; i++){
    obj[arr[i]] = arr[i];
  }
  return obj;
}

function htmlParser(str, match){
  var pattern = new RegExp(match,'i');
  if (pattern.test(str.innerHTML)){
    return str;
  }
}


function blocker(wordBank){
  // {star wars: "star wars", han solo: "han solo", skywalker: "skywalker"}
  var body = document.body.getElementsByTagName('*');
  var node;
  for (var i = 0; i < body.length; i++){
    if (body[i].children.length === 0){
      node = htmlParser(body[i], wordBank);
      if (node){
        node.style.backgroundColor = 'black';
        node.style.color = 'black';
      }
    }
  }
}

function init(wordList){
  var wordBank = createWordBank(words);
  blocker(wordBank);
}

init(['star wars', 'han solo', 'skywalker']);

// element.style.backgroundColor = 'black';
// element.style.color = 'black';

// for (var i =0; i < body.length; i++){
  // body[i].style.backgroundColor = 'black';
  // body[i].style.color = 'black'
// }
