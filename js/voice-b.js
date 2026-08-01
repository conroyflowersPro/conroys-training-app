/* voice-b.js v5.0.1 — loads voice-b.b64.txt then eval */
(function(){
  function run(b64){
    var s=atob(b64);
    var u=new Uint8Array(s.length);
    for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);
    var t=new TextDecoder("utf-8").decode(u);
    (0,eval)(t);
  }
  fetch("js/voice-b.b64.txt?v=5.0.1").then(function(r){return r.text()}).then(run).catch(function(e){
    console.error("voice-b load failed", e);
  });
})();
