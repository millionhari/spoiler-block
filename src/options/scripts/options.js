(function(){
  var addButton = document.querySelector('.button-add');
  addButton.onclick = function(){
    var wordsList = document.querySelector('.block-words').value.split(' ');
    chrome.storage.sync.set({
      wordsList: wordsList
    }, function(){
      console.log('success!');
    });
  };
})();
