/* voice-b.js v5.0.1 — multi-part b64 load */
(function(){
  function run(b64){
    var s=atob(b64);
    var u=new Uint8Array(s.length);
    for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);
    var t=new TextDecoder("utf-8").decode(u);
    (0,eval)(t);
  }
  var urls=["js/voice-b.b64.0.txt?v=5.0.1","js/voice-b.b64.1.txt?v=5.0.1","js/voice-b.b64.2.txt?v=5.0.1","js/voice-b.b64.3.txt?v=5.0.1"];
  Promise.all(urls.map(function(u){return fetch(u).then(function(r){return r.text();});}))
    .then(function(parts){ run(parts.join("")); })
    .catch(function(e){ console.error("voice-b load failed", e); });
})();
