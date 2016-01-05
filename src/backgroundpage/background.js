chrome.runtime.onConnect.addListener(function(port){
  console.assert(port.name === 'spoilerblock');
  port.onMessage.addListener(function(msg){
    if (msg.question === 'What is the block list?'){
      chrome.storage.local.get('wordsList', function(storedList){
        port.postMessage({blockList: storedList});
      });
    }
  });
});
