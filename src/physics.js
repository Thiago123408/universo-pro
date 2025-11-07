import { G, SOFTENING } from "./utils.js";

export function computeGravity(bodies) {
  // zera forças
  for (const b of bodies) { b.fx = 0; b.fy = 0; }

  // Força gravitacional O(n^2)
  for (let i=0; i<bodies.length; i++) {
    for (let j=i+1; j<bodies.length; j++) {
      const bi=bodies[i], bj=bodies[j];
      const dx = bj.x - bi.x;
      const dy = bj.y - bi.y;
      const r2 = dx*dx + dy*dy + SOFTENING*SOFTENING;
      const r = Math.sqrt(r2);
      const f = G * bi.mass * bj.mass / r2;
      const fx = f * dx / r;
      const fy = f * dy / r;
      bi.fx += fx; bi.fy += fy;
      bj.fx -= fx; bj.fy -= fy;
    }
  }
}

export function integrateLeapfrog(bodies, dt) {
  // semi-implícito: v(t+dt/2), x(t+dt), v(t+dt)
  for (const b of bodies) {
    if (b.fixed) continue;
    const ax = b.fx / b.mass;
    const ay = b.fy / b.mass;
    b.vx += ax * dt;
    b.vy += ay * dt;
    b.x  += b.vx * dt;
    b.y  += b.vy * dt;
  }
}

export function handleCollisions(bodies, {merge=true}={}) {
  // Colisão por sobreposição de raios (modelo elástico simples ou fusão)
  const alive = new Set(bodies.map(b=>b.id));
  for (let i=0;i<bodies.length;i++){
    for(let j=i+1;j<bodies.length;j++){
      const a=bodies[i], b=bodies[j];
      if(!alive.has(a.id)||!alive.has(b.id)) continue;
      const dx=b.x-a.x, dy=b.y-a.y;
      const dist=Math.hypot(dx,dy);
      if(dist<=a.radius+b.radius){
        if(merge){
          const m = a.mass + b.mass;
          const vx = (a.vx*a.mass + b.vx*b.mass)/m;
          const vy = (a.vy*a.mass + b.vy*b.mass)/m;
          const x  = (a.x*a.mass + b.x*b.mass)/m;
          const y  = (a.y*a.mass + b.y*b.mass)/m;
          const radius = Math.cbrt(a.radius**3 + b.radius**3); // volume somado → raio equivalente
          a.mass=m; a.vx=vx; a.vy=vy; a.x=x; a.y=y; a.radius=radius;
          a.name = `${a.name}+${b.name}`;
          alive.delete(b.id);
        } else {
          // colisão elástica simplificada: inverte velocidades
          const tvx=a.vx; a.vx=b.vx; b.vx=tvx;
          const tvy=a.vy; a.vy=b.vy; b.vy=tvy;
        }
      }
    }
  }
  return bodies.filter(b=>alive.has(b.id));
}
