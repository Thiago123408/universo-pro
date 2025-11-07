export class Body {
  constructor({id, name, mass, radius, density=5000, x=0, y=0, vx=0, vy=0, color="#8ab4f8", fixed=false}) {
    this.id = id ?? crypto.randomUUID();
    this.name = name ?? "corpo";
    this.mass = mass;       // kg
    this.radius = radius;   // m (para visual)
    this.density = density; // kg/m3 (opcional)
    this.x = x; this.y = y; // m
    this.vx = vx; this.vy = vy; // m/s
    this.ax = 0; this.ay = 0; // m/s2
    this.fx = 0; this.fy = 0; // N (acumula força)
    this.fixed = fixed; // se verdadeiro, não se move (útil p/ testes)
    this.color = color;
    this.trail = [];
  }
  pushTrail(px,py,limit=180){
    this.trail.push({x:px,y:py});
    if(this.trail.length>limit) this.trail.shift();
  }
}
