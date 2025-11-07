# Universo PRO — Simulador do Universo (2D)

Simulador completo com gravidade newtoniana, visual em Canvas 2D, controles interativos, presets e comentários de “IA” local (regra de eventos).

## Funcionalidades
- Gravidade realista (lei de Newton) com Leapfrog.
- Adição de corpos (nome, massa, raio, posição, velocidade).
- Colisões com fusão opcional.
- Trilhas, rótulos, zoom/arrasto, foco por duplo clique.
- Painel de energia (cinética, potencial, total).
- Exportar/Importar estado (JSON).
- Presets: Sistema Solar compacto, Binário + 3 planetas, Disco galáctico simples.

## Como rodar
```bash
cd universo-pro
python3 -m http.server 8080
# abrir http://localhost:8080
