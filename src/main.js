import { Renderer2D } from "./renderer2d.js";
import { computeGravity, integrateLeapfrog, handleCollisions } from "./physics.js";
import { Body } from "./bodies.js";
import { G, MAX_DT, TRAIL_LEN, fmt } from "./utils.js";
import { Commentator } from "./commentator.js";
import { bindUI } from "./ui.js";
import { presetSolar, presetBinary, presetDisc, presetEmpty } from "./presets.js";

class App {
  constructor(){
    this.canvas = document.getElementById('universe');
    this.statsEl = document.getElementById('stats');
    this.commentary = new Commentator(document.getElementById('commentary'));
    this.renderer = new Renderer2D(this.canvas);

    this.bodies=[];
    this.running=true;
    this.timeScale=1; // multiplicador de tempo
    this.flags = { showTrails:true, showLabels:true, mergeCollisions:true };

    bindUI(this);
    this.applyPreset('solar');

    let last=performance.now();
    const loop = ()=>{
      const now=performance.now();
      const dtReal = (now-last)/1000; // em segundos reais
      last=now;

      if(this.running) this.update(Math.min(dtReal, MAX_DT)*this.timeScale);

      this.renderer.draw(this.bodies, {showTrails:this.flags.showTrails, showLabels:this.flags.showLabels});
      requestAnimationFrame(loop);
    };
    loop();
  }

  update(dt){
    // empurra trilha
    for(const b of this.bodies){ b.pushTrail(b.x,b.y,TRAIL_LEN); }

    // física
    computeGravity(this.bodies);
    integrateLeapfrog(this.bodies, dt);

    // eventos/checagens
    this.detectEvents();

    // colisões
    const before = this.bodies.length;
    this.bodies = handleCollisions(this.bodies, {merge:this.flags.mergeCollisions});
    const after = this.bodies.length;
    if(after<before) this.commentary.log(`Fusão/remoção: corpos passaram de ${before} para ${after}.`);

    // HUD
    this.renderStats(dt);
  }

  detectEvents(){
    // aproximação e ejeção (simplificado)
    for(let i=0;i<this.bodies.length;i++){
      const a=this.bodies[i];

      // checa ejeção comparando com gravidade do mais massivo
      const ref = this.bodies[0]; // por simplicidade: primeiro corpo é o “central” nos presets
      if(ref && ref!==a){
        const dx=a.x-ref.x, dy=a.y-ref.y;
        const r=Math.hypot(dx,dy);
        const v=Math.hypot(a.vx,a.vy);
        const vesc=Math.sqrt(2*G*(ref.mass)/r);
        if(v>=vesc*1.05) this.commentary.ejection(a,v,vesc);
      }

      for(let j=i+1;j<this.bodies.length;j++){
        const b=this.bodies[j];
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        const thresh = (a.radius+b.radius)*5;
        if(d<thresh) this.commentary.nearApproach(a,b,d);
      }
    }
  }

  renderStats(dt){
    // energia total (muito simplificada) + contagem
    let ke=0, pe=0;
    for(const b of this.bodies){ ke += 0.5*b.mass*(b.vx*b.vx+b.vy*b.vy); }
    for(let i=0;i<this.bodies.length;i++){
      for(let j=i+1;j<this.bodies.length;j++){
        const a=this.bodies[i], b=this.bodies[j];
        const r=Math.hypot(a.x-b.x,a.y-b.y);
        pe += -G * a.mass * b.mass / r;
      }
    }
    const e=ke+pe;
    this.statsEl.innerHTML =
      `Corpos: ${this.bodies.length} • dt: ${fmt(dt)} s<br/>`+
      `Ecin: ${fmt(ke)} J • Epot: ${fmt(pe)} J • Etot: ${fmt(e)} J`;
  }

  addBody({name, mass, radius, density, x,y,vx,vy}){
    const color = "#"+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0");
    this.bodies.push(new Body({name, mass, radius, density, x,y,vx,vy, color}));
  }

  exportJSON(){
    const data = JSON.stringify(this.bodies, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download="universo_pro_estado.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  importJSON(file){
    const r = new FileReader();
    r.onload = ()=>{
      const arr = JSON.parse(r.result);
      this.bodies = arr.map(o=>new Body(o));
      this.commentary.log(`Estado importado: ${this.bodies.length} corpos.`);
    };
    r.readAsText(file);
  }

  applyPreset(name){
    let arr=[];
    if(name==='solar') arr = presetSolar();
    else if(name==='binary') arr = presetBinary();
    else if(name==='disc') arr = presetDisc();
    else arr = [];

    this.bodies = arr;
    this.resetCamera();
    this.commentary.log(`Preset aplicado: ${name} (${this.bodies.length} corpos).`);
  }

  clearAll(){
    this.bodies=[];
    this.commentary.log("Cena limpa.");
  }

  stepOnce(){
    const step = 1/60 * this.timeScale;
    this.update(step);
  }

  resetCamera(){
    // tenta focar no corpo mais massivo (se houver)
    if(this.bodies.length){
      const m = this.bodies.reduce((a,b)=> b.mass>a.mass?b:a, this.bodies[0]);
      this.renderer.cx = m.x; this.renderer.cy = m.y;
      this.renderer.zoom = 1e-9;
    } else {
      this.renderer.cx=0; this.renderer.cy=0; this.renderer.zoom=1e-9;
    }
  }
}

window.addEventListener('DOMContentLoaded', ()=> new App());
