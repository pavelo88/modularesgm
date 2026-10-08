---
name: videos
description: Videos verticales de Modulares GM (MGM) para redes. Usar cuando pidan "haz un video", "reel", "video para TikTok", "video para Instagram / Facebook", "Shorts", "story en video", "anuncio o promo en video", "video de cocinas / closets / oficinas", "video con voz", "voz de Jorge" o "video mudo" de Modulares GM.
model: sonnet
---

# videos — reels de Modulares GM

Un solo script hace todo el trabajo: `scripts/make_reel.py` (Pillow + ffmpeg); se ejecuta, no hace falta leerlo. Cada video se define en un spec JSON. No reescribas el script para un video puntual: si falta algo, mejora el script para todos.

## 1. Elegir las fotos

- Usa fotos reales de trabajos de GM en `public/images/catalog/extracted_*/` (cocinas, closets, baños, puertas, oficina, escritorios, gamer). No uses fotos de stock: el cliente compra porque ve obras reales.
- Abre cada candidata con Read antes de elegirla. Las carpetas salieron de PDFs y mezclan fotos con portadas, logos y páginas de texto; descarta esas y las fotos borrosas.
- Elige 3–5 fotos. Las verticales llenan la pantalla. Las horizontales se ponen solas sobre un fondo desenfocado.

Listo cuando: tienes 3–5 rutas y viste cada imagen.

## 2. Escribir el spec

Copia `assets/ejemplo-navidad.json` a `videos-out/<nombre>.json` (carpeta ignorada por git) y edítalo. El ejemplo es de la campaña de Navidad 2026: cambia sus fechas y su oferta por las de la campaña vigente.

| Campo | Qué es | Regla o valor por defecto |
|---|---|---|
| `scenes[].photo` | ruta desde la raíz del repo | obligatoria |
| `scenes[].eyebrow` | etiqueta dorada pequeña | ≤ 3 palabras |
| `scenes[].title` | frase grande, obligatoria | ≤ 7 palabras y máximo 4 líneas en el preview |
| `scenes[].say` | lo que dice la voz en esa escena | 1 frase, ≤ 15 palabras; la escena se alarga sola |
| `scenes[].seconds` | duración mínima de esa escena | opcional |
| `end` | cierre obligatorio: `title`, `subtitle`, `cta`, `footer`, `say` | `cta` = "WhatsApp" + teléfono de `src/lib/site.ts` en formato local con espacios (`0XX XXX XXXX`); `say` hasta 2 frases |
| `scene_seconds` | duración mínima de todas las escenas | 2.8 |
| `logo` | logo del cierre | por defecto `public/logo.png` |
| `audio.voice`, `audio.rate`, `audio.volume` | voz de edge-tts, velocidad y volumen | `es-MX-JorgeNeural`, `+5%`, `+0%` |
| `audio.music` | `"auto"` (música original generada, sin derechos), ruta a un MP3 propio, u omitir | |
| `audio.music_volume` | volumen de la música; baja sola cuando habla la voz | 0.35 |
| `brand`, `fonts` | colores hex (`text`, `accent`, `background`, `muted`, `button`) y carpeta de fuentes con `Playfair-Bold.ttf`, `Inter-Medium.ttf` e `Inter-Bold.ttf` | solo para otra empresa |

Reglas del texto:

- La primera escena es el gancho: una pregunta o un beneficio. TikTok decide en 1–2 segundos si sigue mostrando el video.
- Saca precios, fechas y promociones del sitio: `src/lib/campaign.ts` (campaña activa), `CATEGORIES_SEO` en `src/lib/catalog-full.ts` (rangos de precio) y `src/lib/site.ts` (teléfono). Una oferta inventada se convierte en un reclamo por WhatsApp.
- En `say` no dictes el teléfono, porque la voz lee "096" como "noventa y seis". Di "Escríbenos por WhatsApp" y deja el número en pantalla. Escribe en letras las fechas que deben sonar naturales ("trece de noviembre").
- Sin `say` en ninguna escena y sin `audio.music`, el video sale solo mudo.

Listo cuando: `python3 -m json.tool videos-out/<nombre>.json` no da error, cada `title` de escena tiene ≤ 7 palabras y cada dato sale del sitio.

## 3. Renderizar

```bash
python3 .claude/skills/videos/scripts/make_reel.py videos-out/<nombre>.json videos-out/<nombre>.mp4 --preview
```

Requisitos: Python 3.9+, `pip install pillow numpy edge-tts` y ffmpeg (en Windows: `winget install Gyan.FFmpeg`); para la voz de respaldo, `pip install piper-tts`. En Windows el comando es `python`. Un video de 20 s a 1080x1920 tarda alrededor de 1 minuto: dale a la orden un timeout de 10 minutos. Para probar el texto, usa `--size 720`, que es más rápido.

- Con audio salen tres archivos: `<nombre>.mp4` (con sonido), `<nombre>-mudo.mp4` y `<nombre>-preview.jpg` (un cuadro por escena).
- Sin audio solo salen `<nombre>.mp4` (mudo) y el preview.
- Usa `--voice-engine none` o `--no-music` para quitar la voz o la música sin tocar el spec.

Voz: `auto` usa a **Jorge** (Microsoft, vía edge-tts), que necesita acceso a `speech.platform.bing.com`.

- Sin ese acceso, como en la nube de Claude Code, usa la voz de respaldo Piper. Piper tiene acento de España y suena más robótica. La primera vez descarga 19 MB de github.com, y después funciona sin internet.
- El log resume la voz en una línea: `narración: N de M escenas (voz: edge)`. `edge` es Jorge.
- Si N es menor que M, o si aparece `ATENCIÓN`, el video quedó sin narrar en parte o mezcla dos voces. No lo entregues así: repite el render, fuerza una sola voz con `--voice-engine piper`, o avisa al usuario.
- Si salió `piper`, avisa al usuario y ofrece dos caminos: renderizar en su PC, o permitir `speech.platform.bing.com` en la política de red del entorno.

Listo cuando: los archivos existen y, si el spec tiene `say` y no usaste `--voice-engine none`, el log muestra `narración: M de M` con una sola voz y sin `ATENCIÓN`.

## 4. Revisar

- Abre `<nombre>-preview.jpg` con Read. Comprueba que ningún título esté cortado, que el texto se lea sobre la foto y que el logo se vea en el cierre. Si una foto clara apaga el texto, cambia la foto o acorta el título.
- La duración que muestra el log debe estar entre 12 y 30 s. Los videos más largos pierden espectadores antes del cierre con WhatsApp. Si se pasa, acorta los `say` o quita una escena. Si se queda corto, sube `scene_seconds` o agrega una escena.

Listo cuando: viste el preview, la duración está entre 12 y 30 s, y corregiste cada problema con un nuevo render.

## 5. Entregar

- Envía los MP4 con SendUserFile. Si esa herramienta no existe, da sus rutas.
- Junto al video, entrega el texto del post:
  - una línea de gancho;
  - el llamado a la acción "Escríbenos por WhatsApp" con el teléfono de `src/lib/site.ts`;
  - 3–5 hashtags locales (`#Quito`, `#CocinasModulares`, `#Ecuador`, etc.).
- Dile al usuario cuándo usar cada versión:
  - La versión muda va con un sonido en tendencia agregado dentro de TikTok, porque los sonidos de la app dan más alcance.
  - La versión con voz va tal cual. Si quiere, puede sumar un sonido en tendencia a bajo volumen.
- No subas los MP4 a git. `videos-out/` está ignorada porque los videos inflan el repo y cada deploy de Vercel.

Listo cuando el usuario recibió:

- cada MP4 que generó el render (el con sonido y el mudo, o solo el mudo si no había audio);
- el texto del post;
- qué voz se usó.
