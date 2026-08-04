/* v5.3.2 patch — one-shot loading tone (global) */
(function () {
  function playLoadingSoundOnce() {
    try {
      if (typeof unlockAudio === 'function') unlockAudio();
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!window._cfAudioCtx) window._cfAudioCtx = new Ctx();
      var ctx = window._cfAudioCtx;
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      var t0 = ctx.currentTime;
      osc.frequency.setValueAtTime(720, t0);
      osc.frequency.exponentialRampToValueAtTime(540, t0 + 0.18);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      osc.start(t0);
      osc.stop(t0 + 0.25);
    } catch (e) {}
  }
  window.playLoadingSoundOnce = playLoadingSoundOnce;
})();
