#!/usr/bin/env python3
"""Reels verticales de Modulares GM (TikTok / Reels / Shorts) con Pillow + ffmpeg.

Uso (desde cualquier carpeta):
  python make_reel.py SPEC.json SALIDA.mp4 [--size 1080|720] [--voice-engine auto|edge|piper|none]
                                           [--no-music] [--preview]

Siempre escribe un video mudo. Si el spec trae narración ("say") o música, SALIDA.mp4 lleva sonido
y la versión muda queda en SALIDA-mudo.mp4; si no, SALIDA.mp4 es la muda.

Rutas relativas del spec: se buscan desde la carpeta actual, la raíz del repo y la carpeta del spec.
Campos del spec, valores por defecto y requisitos: ver ../SKILL.md.
"""
import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SKILL_DIR = Path(__file__).resolve().parents[1]
REPO = Path(__file__).resolve().parents[4]
FPS, FADE, SR = 30, 0.4, 44100

DEFAULT_BRAND = {
    'text': '#F5F1E5',        # crema
    'accent': '#B88E44',      # dorado latón
    'background': '#19242D',  # carbón
    'muted': '#C8CED2',
    'button': '#25D366',      # verde WhatsApp
}
DEFAULT_LOGO = 'public/logo.png'
DEFAULT_VOICE = 'es-MX-JorgeNeural'
PIPER_URL = 'https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-es-carlfm-x-low.tar.gz'
PIPER_SHA256 = '0156a186de321639e6295521f667758ad086bc8433f0a6797a9f044ed5cf5bf3'
PIPER_MODEL = 'es-carlfm-x-low.onnx'


# ---------------------------------------------------------------- utilidades

def log(*a):
    print('[videos]', *a, file=sys.stderr, flush=True)


def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def resolve(p, spec_dir):
    if not p:
        return None
    if Path(p).is_absolute():
        if Path(p).exists():
            return Path(p)
    else:
        for base in (Path.cwd(), REPO, spec_dir):
            if (base / p).exists():
                return base / p
    raise SystemExit(f'No encuentro el archivo: {p}')


def cover(img, w, h):
    r = max(w / img.width, h / img.height)
    im = img.resize((int(img.width * r) + 1, int(img.height * r) + 1), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def wrap(draw, text, font, maxw):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def decode_audio(path):
    """Cualquier audio -> float32 mono a 44,1 kHz."""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


# ---------------------------------------------------------------- diseño

class Canvas:
    """Todo se diseña a 720 px de ancho y se escala a la resolución pedida."""

    def __init__(self, width, brand, fonts_dir):
        self.W, self.H = width, width * 16 // 9
        self.s = width / 720
        self.c = {k: hex_rgb(v) for k, v in brand.items()}
        self._fonts = {
            'head': fonts_dir / 'Playfair-Bold.ttf',
            'body': fonts_dir / 'Inter-Medium.ttf',
            'bold': fonts_dir / 'Inter-Bold.ttf',
        }

    def px(self, v):
        return int(round(v * self.s))

    def font(self, kind, size):
        return ImageFont.truetype(str(self._fonts[kind]), self.px(size))


def base_frame(cv, photo):
    """Foto vertical a pantalla completa; horizontal centrada sobre su propia versión desenfocada."""
    W, H = cv.W, cv.H
    if photo.height >= photo.width * 1.2:
        return cover(photo, W, H)
    bg = cover(photo, W, H).filter(ImageFilter.GaussianBlur(cv.px(28)))
    bg = Image.blend(bg, Image.new('RGB', (W, H), cv.c['background']), 0.45)
    fg = photo.resize((W, int(photo.height * W / photo.width)), Image.LANCZOS)
    bg.paste(fg, (0, (H - fg.height) // 2 + cv.px(60)))
    return bg


def top_shade(cv):
    h = cv.px(600)
    a = (np.linspace(1, 0, h) ** 1.4 * 215).astype(np.uint8)
    layer = Image.new('RGBA', (cv.W, h), (0, 0, 0, 0))
    layer.putalpha(Image.fromarray(np.ascontiguousarray(np.repeat(a[:, None], cv.W, axis=1)), 'L'))
    return layer


def text_layer(cv, eyebrow, title):
    """Capa transparente con el texto de la escena, debajo de la franja de pestañas de TikTok."""
    layer = Image.new('RGBA', (cv.W, cv.px(600)), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = cv.px(56), cv.px(165)
    if eyebrow:
        d.text((x, y), eyebrow.upper(), font=cv.font('bold', 24), fill=cv.c['accent'])
        y += cv.px(50)
    f = cv.font('head', 64)
    for line in wrap(d, title, f, cv.W - cv.px(150)):
        d.text((x, y), line, font=f, fill=cv.c['text'])
        y += cv.px(76)
    d.rectangle((x, y + cv.px(14), x + cv.px(72), y + cv.px(18)), fill=cv.c['accent'])
    return layer


def load_logo(path, max_w, max_h):
    logo = Image.open(path).convert('RGBA')
    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)
    r = min(max_w / logo.width, max_h / logo.height)
    return logo.resize((int(logo.width * r), int(logo.height * r)), Image.LANCZOS)


def end_card(cv, c, logo_path):
    """Cierre con logo, mensaje y botón de WhatsApp, centrado entre las zonas que tapa TikTok."""
    W, H = cv.W, cv.H
    im = Image.new('RGBA', (W, H), cv.c['background'] + (255,))
    d = ImageDraw.Draw(im)
    blocks = []  # (alto, función que dibuja en y)
    if logo_path:
        logo = load_logo(logo_path, cv.px(320), cv.px(240))
        blocks.append((logo.height + cv.px(56), lambda y, lg=logo: im.alpha_composite(lg, ((W - lg.width) // 2, y))))

    def lines_block(text, kind, size, lead, color, maxw):
        f = cv.font(kind, size)
        ls = wrap(d, text, f, maxw)

        def draw(y):
            for i, ln in enumerate(ls):
                d.text(((W - d.textlength(ln, font=f)) / 2, y + i * cv.px(lead)), ln, font=f, fill=color)
        return len(ls) * cv.px(lead), draw

    if c.get('title'):
        h, fn = lines_block(c['title'], 'head', 54, 68, cv.c['text'], W - cv.px(120))
        blocks.append((h + cv.px(18), fn))
    if c.get('subtitle'):
        h, fn = lines_block(c['subtitle'], 'body', 30, 44, cv.c['muted'], W - cv.px(140))
        blocks.append((h + cv.px(44), fn))
    if c.get('cta'):
        bw, bh = cv.px(540), cv.px(96)
        f = cv.font('bold', 34)

        def btn(y):
            d.rounded_rectangle(((W - bw) // 2, y, (W + bw) // 2, y + bh), cv.px(22), fill=cv.c['button'])
            tw = d.textlength(c['cta'], font=f)
            d.text(((W - tw) / 2, y + (bh - cv.px(40)) / 2), c['cta'], font=f, fill=(255, 255, 255))
        blocks.append((bh + cv.px(36), btn))
    if c.get('footer'):
        h, fn = lines_block(c['footer'], 'body', 26, 36, cv.c['accent'], W - cv.px(120))
        blocks.append((h, fn))

    # Zona útil: debajo de las pestañas (≈140) y encima del texto del post (≈H-300), en unidades de 720.
    top, bottom = cv.px(140), H - cv.px(300)
    y = top + max(0, (bottom - top - sum(h for h, _ in blocks)) // 2)
    for h, fn in blocks:
        fn(y)
        y += h
    return im.convert('RGB')


# ---------------------------------------------------------------- voz

class Voice:
    def __init__(self, engine, voice, rate, volume, workdir):
        self.engine, self.voice, self.rate, self.volume = engine, voice, rate, volume
        self.dir = workdir
        self.used = set()
        self._broken = set()

    def _edge(self, text, out):
        import asyncio
        import edge_tts  # pip install edge-tts
        proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')

        async def run():
            await edge_tts.Communicate(text, self.voice, rate=self.rate, volume=self.volume, proxy=proxy).save(str(out))
        asyncio.run(run())
        if not out.exists() or out.stat().st_size == 0:
            raise RuntimeError('edge-tts no devolvió audio')

    def _piper(self, text, out):
        import piper  # noqa: F401  (pip install piper-tts)
        cache = Path(os.environ.get('MGM_VIDEOS_CACHE', Path.home() / '.cache' / 'mgm-videos')) / 'piper'
        model = cache / PIPER_MODEL
        if not model.exists():
            cache.mkdir(parents=True, exist_ok=True)
            tgz = cache / 'voice.tar.gz'
            log('descargando voz de respaldo (19 MB, una sola vez)...')
            subprocess.run(['curl', '-sSL', '--fail', '-o', str(tgz), PIPER_URL], check=True)
            if hashlib.sha256(tgz.read_bytes()).hexdigest() != PIPER_SHA256:
                tgz.unlink()
                raise RuntimeError('la descarga de la voz de respaldo no coincide con su huella SHA-256')
            shutil.unpack_archive(str(tgz), str(cache))
            tgz.unlink()
        subprocess.run([sys.executable, '-m', 'piper', '-m', str(model), '-f', str(out)],
                       input=text.encode('utf-8'), capture_output=True, check=True)

    def say(self, text, idx):
        order = {'auto': ['edge', 'piper'], 'edge': ['edge'], 'piper': ['piper']}.get(self.engine, [])
        for eng in order:
            if eng in self._broken:
                continue
            out = self.dir / f'voz-{idx}.{"mp3" if eng == "edge" else "wav"}'
            for attempt in (1, 2):  # un reintento por si fue un corte momentáneo
                try:
                    getattr(self, f'_{eng}')(text, out)
                    self.used.add(eng)
                    return decode_audio(out)
                except Exception as e:  # sin red, sin paquete, etc.
                    err = f'{type(e).__name__}: {str(e)[:160]}'
            self._broken.add(eng)
            log(f'voz {eng} no disponible: {err}')
        return None


# ---------------------------------------------------------------- música

def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def generate_music(seconds, seed=7):
    """Fondo cálido original (pad + campanitas en Re mayor, 96 bpm). Libre de derechos: se genera aquí."""
    rng = np.random.default_rng(seed)
    n = int(seconds * SR) + SR
    t = np.arange(n) / SR
    out = np.zeros(n, dtype=np.float64)
    bar = 2.5  # 4 tiempos a 96 bpm
    chords = [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]]  # D  A  Bm  G
    for b in range(int(np.ceil(seconds / bar)) + 1):
        ch = chords[b % 4]
        s0, s1 = int(b * bar * SR), min(n, int((b + 1.15) * bar * SR))
        if s0 >= n:
            break
        tt = t[s0:s1] - b * bar
        env = np.minimum(1, tt / 0.6) * np.clip((bar * 1.15 - tt) / 0.5, 0, 1)
        for note in ch:
            f = midi(note - 12)
            out[s0:s1] += env * 0.10 * (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.006 * tt))
        out[s0:s1] += env * 0.12 * np.sin(2 * np.pi * midi(ch[0] - 24) * tt)  # bajo
        arp = ch + [ch[1] + 12]
        for k in range(8):  # corcheas de campana
            st = int((b * bar + k * bar / 8) * SR)
            if st >= n:
                break
            seg = min(n - st, int(1.2 * SR))
            tk = np.arange(seg) / SR
            f = midi(arp[k % 4] + 12)
            vel = 0.05 + 0.02 * rng.random()
            out[st:st + seg] += vel * np.exp(-tk * 4.5) * (np.sin(2 * np.pi * f * tk) + 0.25 * np.sin(2 * np.pi * f * 2.76 * tk))
    for delay, g in ((0.23, 0.28), (0.37, 0.16)):  # reverberación sencilla
        d = int(delay * SR)
        out[d:] += g * out[:-d].copy()
    out = out[:int(seconds * SR)]
    fade_in, fade_out = int(0.8 * SR), int(1.5 * SR)
    out[:fade_in] *= np.linspace(0, 1, fade_in)
    out[-fade_out:] *= np.linspace(1, 0, fade_out)
    return (out / (np.abs(out).max() + 1e-9) * 0.9).astype(np.float32)


def fit_length(x, n):
    if len(x) >= n:
        return x[:n]
    return np.tile(x, int(np.ceil(n / max(1, len(x)))))[:n]


def duck_curve(voice, base, low):
    """Baja la música mientras habla la voz y la sube en las pausas."""
    hop = int(0.01 * SR)
    frames = int(np.ceil(len(voice) / hop))
    padded = np.pad(voice, (0, frames * hop - len(voice)))
    rms = np.sqrt((padded.reshape(frames, hop) ** 2).mean(axis=1))
    active = np.clip(np.convolve((rms > 0.01).astype(np.float64), np.ones(30), 'same'), 0, 1)  # 0,3 s de margen
    smooth = np.convolve(active, np.ones(20) / 20, 'same')
    return np.repeat(base - (base - low) * smooth, hop)[:len(voice)].astype(np.float32)


# ---------------------------------------------------------------- render

def render(spec_path, out_path, size, engine, no_music, preview):
    spec_path = Path(spec_path).resolve()
    spec = json.loads(spec_path.read_text(encoding='utf-8'))
    if not spec.get('scenes') or not spec.get('end'):
        raise SystemExit('El spec necesita "scenes" (al menos una foto) y "end" (cierre con WhatsApp).')
    for i, sc in enumerate(spec['scenes'], 1):
        if not sc.get('photo') or not sc.get('title'):
            raise SystemExit(f'La escena {i} necesita "photo" y "title".')
    sd = spec_path.parent
    out_path = Path(out_path).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    for tool in ('ffmpeg', 'ffprobe'):
        if not shutil.which(tool):
            raise SystemExit(f'Falta {tool}. Instálalo (Windows: winget install Gyan.FFmpeg).')

    brand = {**DEFAULT_BRAND, **spec.get('brand', {})}
    fonts = resolve(spec['fonts'], sd) if spec.get('fonts') else SKILL_DIR / 'assets' / 'fonts'
    cv = Canvas(size, brand, fonts)
    logo_rel = spec.get('logo', DEFAULT_LOGO)
    logo = resolve(logo_rel, sd) if logo_rel else None
    default_s = float(spec.get('scene_seconds', 2.8))
    audio_cfg = spec.get('audio', {})

    scenes = [dict(s, kind='photo') for s in spec['scenes']] + [dict(spec['end'], kind='end')]
    photos = [resolve(s['photo'], sd) for s in scenes if s['kind'] == 'photo']  # falla antes de narrar
    tmp = Path(tempfile.mkdtemp(prefix='mgm-video-'))
    try:
        # 1) Narración por escena: la escena dura lo que dure su frase (mínimo scene_seconds).
        wants_voice = engine != 'none' and any(s.get('say') for s in scenes)
        voice = Voice(engine, audio_cfg.get('voice', DEFAULT_VOICE), audio_cfg.get('rate', '+5%'),
                      audio_cfg.get('volume', '+0%'), tmp) if wants_voice else None
        clips = []
        for i, s in enumerate(scenes):
            clip = voice.say(s['say'], i) if voice and s.get('say') else None
            dur = float(s.get('seconds', default_s))
            if clip is not None:
                dur = max(dur, len(clip) / SR + 0.3 + 0.45)
            clips.append(clip)
            s['dur'] = dur
        if voice:
            want = sum(1 for s in scenes if s.get('say'))
            got = sum(1 for s, c in zip(scenes, clips) if s.get('say') and c is not None)
            used = ', '.join(sorted(voice.used)) or 'ninguna'
            log(f'narración: {got} de {want} escenas (voz: {used})')
            if got < want and engine != 'auto':
                raise SystemExit(f'La voz "{engine}" falló en {want - got} escena(s); no se generó ningún video.')
            if got < want:
                log(f'ATENCIÓN: {want - got} escena(s) quedaron SIN narración.')
            if len(voice.used) > 1:
                log('ATENCIÓN: el video mezcla dos voces distintas.')
        total = sum(s['dur'] for s in scenes)

        # 2) Video mudo.
        silent = out_path.with_name(out_path.stem + '-mudo.mp4')
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{cv.W}x{cv.H}',
               '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
               '-movflags', '+faststart', str(silent)]
        ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        shade = top_shade(cv)
        prev_last, shots, photo_iter = None, [], iter(photos)
        for s in scenes:
            n = int(round(s['dur'] * FPS))
            if s['kind'] == 'photo':
                img = base_frame(cv, Image.open(next(photo_iter)).convert('RGB'))
                txt = text_layer(cv, s.get('eyebrow'), s['title'])
            else:
                img, txt = end_card(cv, s, logo), None
            last = None
            for i in range(n):
                t = i / FPS
                if s['kind'] == 'photo':
                    z = 1.0 + 0.08 * (i / n)  # zoom lento (Ken Burns)
                    zw, zh = int(cv.W / z), int(cv.H / z)
                    fr = img.crop(((cv.W - zw) // 2, (cv.H - zh) // 2, (cv.W + zw) // 2, (cv.H + zh) // 2))
                    fr = fr.resize((cv.W, cv.H), Image.BILINEAR).convert('RGBA')
                    fr.alpha_composite(shade)
                    ease = min(1.0, t / 0.45)
                    if ease < 1:  # el texto entra con un leve deslizamiento
                        layer = txt.copy()
                        layer.putalpha(layer.getchannel('A').point(lambda a, e=ease: int(a * e)))
                        fr.alpha_composite(layer, (0, int((1 - ease) * cv.px(26))))
                    else:
                        fr.alpha_composite(txt)
                    fr = fr.convert('RGB')
                else:
                    fr = img
                if prev_last is not None and t < FADE:  # fundido con la escena anterior
                    fr = Image.blend(prev_last, fr, t / FADE)
                ff.stdin.write(fr.tobytes())
                last = fr
                if preview and i == min(n - 1, int(1.2 * FPS)):
                    shots.append(fr)
            prev_last = last
        ff.stdin.close()
        if ff.wait() != 0:
            raise SystemExit('ffmpeg falló al codificar el video')

        if preview and shots:
            tw, gap = 240, 8
            th = tw * 16 // 9
            sheet = Image.new('RGB', (tw * len(shots) + gap * (len(shots) + 1), th + 2 * gap), (20, 20, 20))
            for k, sh in enumerate(shots):
                sheet.paste(sh.resize((tw, th), Image.LANCZOS), (gap + k * (tw + gap), gap))
            pv = out_path.with_name(out_path.stem + '-preview.jpg')
            sheet.save(pv, quality=85)
            log('vista previa:', pv)

        # 3) Audio: voz + música con ducking, normalizado a -14 LUFS (lo que esperan TikTok y Reels).
        n_total = int(total * SR)
        voice_track = np.zeros(n_total, dtype=np.float32)
        t0 = 0.0
        for s, clip in zip(scenes, clips):
            if clip is not None:
                st = int((t0 + 0.3) * SR)
                seg = clip[:max(0, n_total - st)]
                voice_track[st:st + len(seg)] += seg
            t0 += s['dur']
        has_voice = bool(np.abs(voice_track).max() > 0)
        if has_voice:
            voice_track *= 0.95 / np.abs(voice_track).max()

        music_src = None if no_music else audio_cfg.get('music')
        music = None
        if music_src == 'auto':
            music = generate_music(total)
        elif music_src:
            music = fit_length(decode_audio(resolve(music_src, sd)), n_total)
            fade = min(n_total, int(1.5 * SR))
            music[-fade:] *= np.linspace(1, 0, fade)
            music *= 0.9 / (np.abs(music).max() + 1e-9)
        if music is not None:
            music = fit_length(music, n_total)
            base = float(audio_cfg.get('music_volume', 0.35))
            gain = duck_curve(voice_track, base, base * 0.3) if has_voice else np.full(n_total, base, np.float32)
            mix = voice_track + music * gain
        else:
            mix = voice_track if has_voice else None

        if mix is None:
            silent.replace(out_path)
            log('sin audio: video mudo en', out_path)
        else:
            mix = mix / max(1.0, float(np.abs(mix).max()) / 0.98)
            wav = tmp / 'mix.wav'
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', str(wav)],
                           input=mix.astype(np.float32).tobytes(), check=True)
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(silent), '-i', str(wav), '-map', '0:v', '-map', '1:a',
                            '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '160k',
                            '-ar', str(SR), '-ac', '2', '-shortest', '-movflags', '+faststart', str(out_path)], check=True)
            used = ', '.join(sorted(voice.used)) if voice and has_voice else 'no'
            log('con sonido:', out_path, f'(voz: {used}; música: {"sí" if music is not None else "no"})')
            log('mudo:', silent)
        log(f'duración {total:.1f} s, {cv.W}x{cv.H}')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser(description='Reels verticales de Modulares GM')
    ap.add_argument('spec')
    ap.add_argument('out')
    ap.add_argument('--size', type=int, choices=(720, 1080), default=1080, help='ancho en px; el alto es 16:9 vertical')
    ap.add_argument('--voice-engine', choices=('auto', 'edge', 'piper', 'none'), default='auto',
                    help='auto = Jorge (edge-tts) y, si no hay acceso, la voz de respaldo piper')
    ap.add_argument('--no-music', action='store_true')
    ap.add_argument('--preview', action='store_true', help='guarda SALIDA-preview.jpg con un cuadro por escena')
    a = ap.parse_args()
    render(a.spec, a.out, a.size, a.voice_engine, a.no_music, a.preview)


if __name__ == '__main__':
    main()
