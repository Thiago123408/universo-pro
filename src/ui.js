export function bindUI(app){
  const $ = sel=>document.querySelector(sel);
  const presetSel = $("#preset");
  $("#applyPreset").onclick = ()=>app.applyPreset(presetSel.value);
  $("#clearAll").onclick = ()=>app.clearAll();

  const time = $("#timeScale");
  const timeVal = $("#timeScaleVal");
  const updateTime = ()=>{ app.timeScale = parseFloat(time.value); timeVal.textContent = `${app.timeScale.toFixed(2)}x`; }
  time.oninput = updateTime; updateTime();

  const playBtn = $("#playPause");
  playBtn.onclick = ()=>{
    app.running = !app.running;
    playBtn.textContent = app.running ? "⏯︎ Pausar" : "▶️ Reproduzir";
  };

  $("#step").onclick = ()=>app.stepOnce();
  $("#resetCamera").onclick = ()=>app.resetCamera();

  app.flags.showTrails = $("#toggleTrails").checked;
  app.flags.showLabels = $("#toggleLabels").checked;
  app.flags.mergeCollisions = $("#mergeCollisions").checked;

  $("#toggleTrails").onchange = e=>app.flags.showTrails = e.target.checked;
  $("#toggleLabels").onchange = e=>app.flags.showLabels = e.target.checked;
  $("#mergeCollisions").onchange = e=>app.flags.mergeCollisions = e.target.checked;

  // novo corpo
  $("#addBody").onclick = ()=>{
    const name = $("#newName").value || "Novo";
    const mass = parseFloat($("#newMass").value);
    const radius = parseFloat($("#newRadius").value);
    const density = parseFloat($("#newDensity").value);
    const x = parseFloat($("#newX").value);
    const y = parseFloat($("#newY").value);
    const vx = parseFloat($("#newVx").value);
    const vy = parseFloat($("#newVy").value);
    app.addBody({name, mass, radius, density, x, y, vx, vy});
  };

  // export/import
  $("#exportJSON").onclick = ()=>app.exportJSON();
  $("#importJSON").onchange = (e)=>app.importJSON(e.target.files[0]);
}
