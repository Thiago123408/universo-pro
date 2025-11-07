import { Body } from "./bodies.js";

const colorStar = "#ffd166";
const colorPlanet = "#8ab4f8";
const colorRock = "#a0aec0";

export function presetSolar(){
  // Sistema solar "compacto" (escalas reduzidas para caber bem)
  const sun = new Body({name:"Sol", mass:1.989e30, radius:6.9634e8, x:0, y:0, vx:0, vy:0, color:colorStar});
  const earth = new Body({name:"Terra", mass:5.972e24, radius:6.371e6, x:1.5e11, y:0, vx:0, vy:29780, color:colorPlanet});
  const mars  = new Body({name:"Marte", mass:6.39e23, radius:3.389e6, x:2.279e11, y:0, vx:0, vy:24070, color:"#fca5a5"});
  const venus = new Body({name:"Vênus", mass:4.867e24, radius:6.051e6, x:1.082e11, y:0, vx:0, vy:35020, color:"#eab308"});
  return [sun, earth, mars, venus];
}

export function presetBinary(){
  // duas estrelas + 3 planetas
  const s1 = new Body({name:"Aster A", mass:1.2e30, radius:6e8, x:-4e10, y:0, vx:0, vy:-18000, color:colorStar});
  const s2 = new Body({name:"Aster B", mass:0.8e30, radius:5e8, x:+4e10, y:0, vx:0, vy:+18000, color:"#ffe08a"});
  const p1 = new Body({name:"P1", mass:4e24, radius:5e6, x:0, y:1.2e11, vx:-32000, vy:0, color:colorPlanet});
  const p2 = new Body({name:"P2", mass:6e24, radius:6e6, x:0, y:-1.8e11, vx:+28000, vy:0, color:"#22d3ee"});
  const p3 = new Body({name:"P3", mass:8e23, radius:4e6, x:2.3e11, y:0, vx:0, vy:+18000, color:colorRock});
  return [s1,s2,p1,p2,p3];
}

export function presetDisc(){
  // disco simples de "estrelas" orbitando um centro massivo
  const center = new Body({name:"Buraco Negro", mass:4e36, radius:8e9, x:0,y:0, color:"#94a3b8"});
  const arr=[center];
  const N=120;
  for(let i=0;i<N;i++){
    const r = 2e11 + Math.random()*2.5e12;
    const ang = Math.random()*Math.PI*2;
    const x = Math.cos(ang)*r, y=Math.sin(ang)*r;
    const v = Math.sqrt(center.mass*6.67430e-11 / r);
    const vx = -Math.sin(ang)*v*(0.9+0.2*Math.random());
    const vy =  Math.cos(ang)*v*(0.9+0.2*Math.random());
    arr.push(new Body({name:`E${i}`, mass:1e29*(0.5+Math.random()), radius:5e8*(0.5+Math.random()),
      x,y,vx,vy,color:"#c084fc"}));
  }
  return arr;
}

export function presetEmpty(){ return []; }
