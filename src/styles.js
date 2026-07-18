export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;600;800&display=swap');

  :root {
    --lima: #C8D62B;
    --negro: #121210;
    --panel: #17170f;
    --crema: #F5F1E0;
    --ok: #46AB4F;
    --go: #F3C51D;
    --no: #E14B3B;
    --no-bg: #3B1512;
    --accent: var(--lima);
    --body: 'Archivo', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif;
    --disp: 'Anton', 'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { min-height: 100%; }
  body { font-family: var(--body); background: var(--accent); color: var(--negro); }
  #root { min-height: 100vh; }
  button, a { font: inherit; }

  .pagina {
    min-height: 100vh;
    padding: clamp(14px, 3vw, 36px);
  }

  .cabecera {
    max-width: 1120px;
    margin: 0 auto 18px;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .22em;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .eyebrow::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background: var(--accent);
    border-radius: 999px;
  }

  h1 {
    font-family: var(--disp);
    text-transform: uppercase;
    font-size: clamp(34px, 6.5vw, 64px);
    line-height: .92;
    letter-spacing: .01em;
    font-weight: 400;
  }
  p { line-height: 1.5; }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .header-row .intro {
    max-width: 760px;
    opacity: .86;
  }

  .selector-panel,
  .preparacion-panel,
  .panel {
    max-width: 1120px;
    margin: 0 auto;
    background: var(--panel);
    border: 3px solid var(--negro);
    border-radius: 18px;
    box-shadow: 9px 9px 0 rgba(18,18,16,.55);
    padding: clamp(14px, 2.5vw, 28px);
    color: var(--crema);
  }

  .carrera-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  .carrera-card,
  .reset-link,
  .selector-button {
    display: block;
    text-decoration: none;
    color: inherit;
    border: 2px solid var(--crema);
    border-radius: 16px;
    background: rgba(255,255,255,.05);
    padding: 18px 16px;
    transition: transform .12s ease, border-color .12s ease, background .12s ease;
  }
  .carrera-card:hover,
  .selector-button:hover,
  .reset-link:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    background: rgba(255,255,255,.11);
  }
  .carrera-card.activa strong { color: var(--accent); }
  .carrera-card.inactivo { opacity: .72; }
  .carrera-card .estado { display: block; margin-top: 10px; font-size: 13px; font-weight: 700; letter-spacing: .04em; }

  /* Paso intermedio de Comunicación: tarjeta de plan con la guía de transición. */
  .plan-card .quien { display: block; margin-top: 8px; font-size: 12.5px; line-height: 1.5; opacity: .8; font-weight: 600; }
  .marca-extinguir {
    display: inline-block; margin-left: 8px; vertical-align: 2px;
    font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em;
    padding: 2px 7px; border-radius: 999px; border: 1.5px solid var(--accent); color: var(--accent);
  }

  .message {
    font-size: 15px;
    line-height: 1.7;
    display: grid;
    gap: 14px;
  }

  .reset-link,
  .selector-button {
    width: fit-content;
    background: var(--accent);
    color: var(--negro);
    border-color: transparent;
    box-shadow: 3px 3px 0 var(--negro);
    border-radius: 999px;
    padding: 10px 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .05em;
  }

  .pagina.landing {
    background: var(--accent);
  }

  .tablero { margin-top: 16px; display: grid; gap: 12px; }
  .contador { display: flex; align-items: baseline; gap: 8px; }
  .contador .num { font-family: var(--disp); font-size: clamp(38px, 5vw, 52px); line-height: 1; }
  .contador .de { font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }

  .progreso { max-width: 680px; }
  .barra {
    position: relative;
    height: 16px;
    background: var(--negro);
    border: 2px solid var(--negro);
    border-radius: 999px;
    overflow: hidden;
  }
  .lleno { height: 100%; background: var(--ok); transition: width .35s ease; }
  .tickbar { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--crema); opacity: .85; }
  .marcas { position: relative; height: 16px; margin-top: 3px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .marcas span { position: absolute; transform: translateX(-50%); white-space: nowrap; }

  .hitos { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .pill {
    border: 2px solid var(--negro);
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .04em;
  }
  .pill.on { background: var(--negro); color: var(--accent); }

  .reset {
    margin-left: auto;
    border: 2px solid var(--negro);
    background: var(--crema);
    border-radius: 999px;
    padding: 6px 14px;
    font-family: var(--body);
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .04em;
    cursor: pointer;
    box-shadow: 3px 3px 0 var(--negro);
    transition: transform .08s ease;
  }
  .reset:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--negro); }
  .reset.seguro { background: var(--no); color: #fff; }

  .leyenda {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .02em;
    padding-bottom: 14px;
    border-bottom: 1px dashed rgba(245,241,224,.25);
    margin-bottom: 6px;
  }
  .dot { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 5px; border: 1.5px solid rgba(0,0,0,.5); vertical-align: -1px; }
  .dot.ok { background: var(--ok); } .dot.go { background: var(--go); } .dot.no { background: var(--no); }
  .guardado { margin-left: auto; opacity: .65; font-weight: 600; }

  .bloque { margin-top: 22px; }
  .bloque-head { display: flex; align-items: end; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
  .bloque-head h2,
  .bloque-head h3 { font-family: var(--disp); font-weight: 400; text-transform: uppercase; color: var(--accent); font-size: clamp(18px, 2.4vw, 24px); letter-spacing: .04em; }
  .bloque-head p { font-size: 12px; opacity: .7; margin-top: 2px; max-width: 640px; }
  .conteo { font-family: 'Courier New', monospace; font-weight: 700; font-size: 15px; opacity: .85; white-space: nowrap; }
  .grilla { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(235px, 1fr)); }

  .orientaciones { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 4px 0 14px; }
  .ori-label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; opacity: .75; }
  .ori { border: 2px solid rgba(245,241,224,.45); background: transparent; color: var(--crema); border-radius: 999px; padding: 5px 11px; font-family: var(--body); font-size: 11.5px; font-weight: 700; cursor: pointer; }
  .ori em { font-style: normal; opacity: .6; font-weight: 600; }
  .ori.activa { background: var(--accent); border-color: var(--accent); color: var(--negro); }
  .ori.activa em { opacity: .75; }
  .ori:focus-visible { outline: 3px solid var(--crema); outline-offset: 2px; }

  .card {
    position: relative;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    text-align: left;
    border-radius: 12px;
    padding: 11px 12px;
    border: 2px solid var(--negro);
    box-shadow: 4px 4px 0 rgba(0,0,0,.5);
    font-family: var(--body);
    cursor: pointer;
    transition: transform .08s ease, box-shadow .08s ease;
    background: rgba(255,255,255,.04);
  }
  .card:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0 rgba(0,0,0,.5); }
  .card:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 rgba(0,0,0,.5); }
  .card:focus-visible { outline: 3px solid var(--crema); outline-offset: 2px; }
  .card.ok { background: var(--ok); color: #0c1c0e; }
  .card.go { background: var(--go); color: #1b1500; }
  .card.no { background: var(--no-bg); color: #F2B7AE; border-color: var(--no); cursor: not-allowed; }
  .card.no:hover { transform: none; box-shadow: 4px 4px 0 rgba(0,0,0,.5); }

  .tick { flex: none; width: 22px; height: 22px; margin-top: 1px; border: 2.5px solid currentColor; border-radius: 6px; display: grid; place-items: center; font-weight: 900; font-size: 15px; line-height: 1; background: rgba(255,255,255,.25); }
  .card.no .tick { background: repeating-linear-gradient(45deg, transparent 0 4px, rgba(225,75,59,.55) 4px 8px); border-color: var(--no); }
  .cuerpo { display: grid; gap: 3px; min-width: 0; }
  .nom { font-weight: 800; font-size: 13.5px; line-height: 1.25; }
  .meta { font-size: 11px; line-height: 1.35; font-weight: 600; }
  .meta.abre { opacity: .72; }
  .meta.pide { opacity: .78; }
  .meta.falta { color: #FF9C8D; font-weight: 700; }

  .sello,
  .flash { position: absolute; top: -8px; right: 8px; transform: rotate(-7deg); font-family: var(--disp); font-size: 10px; letter-spacing: .12em; border-radius: 4px; padding: 1px 7px; }
  .sello { color: #0c1c0e; background: var(--accent); border: 2px solid #0c1c0e; }
  .flash { color: var(--go); background: var(--negro); border: 2px solid var(--go); }

  .card.nueva { animation: pulso 1s ease-in-out 3; }
  @keyframes pulso { 0%, 100% { box-shadow: 4px 4px 0 rgba(0,0,0,.5); } 50% { box-shadow: 0 0 0 5px rgba(243,197,29,.55), 4px 4px 0 rgba(0,0,0,.5); } }
  .card.tiembla { animation: sacudida .4s ease; }
  @keyframes sacudida { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }

  .pie { margin-top: 26px; padding-top: 12px; border-top: 1px dashed rgba(245,241,224,.25); font-size: 11px; opacity: .6; line-height: 1.5; }

  .pagina.landing .cabecera { color: #0d110a; }

  @media (prefers-reduced-motion: reduce) {
    .card.nueva, .card.tiembla { animation: none; }
    .lleno { transition: none; }
  }
  @media (max-width: 520px) {
    .grilla { grid-template-columns: 1fr; }
    .reset { margin-left: 0; }
    .header-row { flex-direction: column; align-items: flex-start; }
  }
`;
