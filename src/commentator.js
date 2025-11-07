import { nowStr } from "./utils.js";

// "IA" local baseada em regras: gera comentários sobre eventos relevantes
export class Commentator {
  constructor(outEl){
    this.outEl=outEl;
    this.lastNotes=new Map(); // evita spam de mensagens
  }

  log(msg){
    const p=document.createElement('p');
    const t=document.createElement('span');
    t.className='time'; t.textContent=`[${nowStr()}] `;
    p.appendChild(t);
    p.appendChild(document.createTextNode(msg));
    this.outEl.prepend(p);
  }

  nearApproach(a,b,dist){
    const key=`near:${a.id}:${b.id}`;
    const last=this.lastNotes.get(key)||0;
    if(performance.now()-last>4000){
      this.lastNotes.set(key, performance.now());
      this.log(`Aproximação: “${a.name}” está a ${dist.toExponential(2)} m de “${b.name}”.`);
    }
  }

  ejection(b, speed, esc){
    const key=`eject:${b.id}`;
    const last=this.lastNotes.get(key)||0;
    if(performance.now()-last>6000){
      this.lastNotes.set(key, performance.now());
      this.log(`Possível ejeção: “${b.name}” com ${speed.toFixed(0)} m/s ≥ v_esc ${esc.toFixed(0)} m/s.`);
    }
  }

  collision(a,b){
    this.log(`Colisão detectada entre “${a.name}” e “${b.name}”. Resultante pode ter massa/fusão maior.`);
  }
}
