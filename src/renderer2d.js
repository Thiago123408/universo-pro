import { TRAIL_LEN } from "./utils.js";

export class Renderer2D {
  constructor(canvas){
    this.canvas=canvas;
    this.ctx=canvas.getContext("2d");
    this.w=canvas.width=canvas.clientWidth||canvas.offsetWidth||800;
    this.h=canvas.height=canvas.clientHeight||canvas.offsetHeight||600;

    // câmera
    this.cx=0; this.cy=0;      // centro em metros
    this.zoom=1e-9;            // metros → pixels (ajustável)
    this.dragging=false; this.lastMouse=null;

    // eventos
    canvas.addEventListener('wheel', e=>{
      e.preventDefault();
      const factor = e.deltaY>0?0.9:1.1;
      this.zoom*=factor;
    }, {passive:false});

    canvas.addEventListener('mousedown', e=>{
      this.dragging=true; this.lastMouse={x:e.clientX,y:e.clientY};
    });
    window.addEventListener('mouseup', ()=>this.dragging=false);
    window.addEventListener('mousemove', e=>{
      if(!this.dragging) return;
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      this.cx -= dx/this.zoom;
      this.cy -= dy/this.zoom;
      this.lastMouse={x:e.clientX,y:e.clientY};
    });

    canvas.addEventListener('dblclick', e=>{
      if(!this._bodies) return;
      const {offsetX, offsetY}=e;
      const wx = (offsetX - this.w/2)/this.zoom + this.cx;
      const wy = (offsetY - this.h/2)/this.zoom + this.cy;
      // encontra o corpo mais perto do clique
      let best=null, bd=Infinity;
      for(const b of this._bodies){
        const d=Math.hypot(b.x-wx,b.y-wy);
        if(d<bd){ bd=d; best=b; }
      }
      if(best){
        this.cx = best.x;
        this.cy = best.y;
      }
    });

    // responsivo
    const ro = new ResizeObserver(()=>this.resize());
    ro.observe(canvas);
  }

  resize(){
    this.w=this.canvas.width=this.canvas.clientWidth;
    this.h=this.canvas.height=this.canvas.clientHeight;
  }

  worldToScreen(x,y){
    return {
      x: (x - this.cx)*this.zoom + this.w/2,
      y: (y - this.cy)*this.zoom + this.h/2
    };
  }

  draw(bodies, {showTrails=true, showLabels=true}={}){
    this._bodies=bodies;
    const ctx=this.ctx;
    ctx.clearRect(0,0,this.w,this.h);

    // fundo estrelas leve
    ctx.fillStyle="#0b0f1a";
    ctx.fillRect(0,0,this.w,this.h);

    // eixos suaves
    ctx.strokeStyle="rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.moveTo(0, this.h/2); ctx.lineTo(this.w, this.h/2);
    ctx.moveTo(this.w/2, 0); ctx.lineTo(this.w/2, this.h);
    ctx.stroke();

    // trilhas
    if(showTrails){
      ctx.lineWidth=1;
      for(const b of bodies){
        if(b.trail.length<2) continue;
        ctx.strokeStyle = b.color+"cc";
        ctx.beginPath();
        const p0=this.worldToScreen(b.trail[0].x,b.trail[0].y);
        ctx.moveTo(p0.x,p0.y);
        for(let i=1;i<b.trail.length;i++){
          const p=this.worldToScreen(b.trail[i].x,b.trail[i].y);
          ctx.lineTo(p.x,p.y);
        }
        ctx.stroke();
      }
    }

    // corpos
    for (const b of bodies){
      const p = this.worldToScreen(b.x,b.y);
      const rpx = Math.max(1, b.radius*this.zoom); // raio em pixels (min 1px)
      ctx.fillStyle=b.color;
      ctx.beginPath();
      ctx.arc(p.x,p.y,rpx,0,Math.PI*2);
      ctx.fill();

      if(showLabels){
        ctx.fillStyle="#e8eef6";
        ctx.font="12px system-ui";
        ctx.textAlign="center";
        ctx.fillText(b.name, p.x, p.y - (rpx+6));
      }
    }
  }
}
