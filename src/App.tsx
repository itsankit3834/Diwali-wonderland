import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, VolumeX, Sparkles, Heart, Moon, Stars, Gift, ChevronDown, Music2, X } from 'lucide-react'
import { config } from './config'

type Burst = { id: number; x: number; y: number; hue: number }
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: .8, ease: 'easeOut' as const } } }

function Diya({ lit, onClick, small = false }: { lit: boolean; onClick: (e: MouseEvent<HTMLButtonElement>) => void; small?: boolean }) {
  return <button className={`diya ${lit ? 'is-lit' : ''} ${small ? 'diya-small' : ''}`} onClick={onClick} aria-label={lit ? 'A diya is glowing' : 'Light this diya'}>
    <span className="flame"><i /></span><span className="wick" /><span className="bowl" /><span className="diya-glow" />
  </button>
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <motion.div className="section-title" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
    <span className="eyebrow"><span />{eyebrow}<span /></span>
    <h2>{title}</h2><p>{subtitle}</p>
  </motion.div>
}

function App() {
  const [entered, setEntered] = useState(false)
  const [lit, setLit] = useState<number[]>([])
  const [letterOpen, setLetterOpen] = useState(false)
  const [fortune, setFortune] = useState('')
  const [rangoli, setRangoli] = useState(false)
  const [lastOpen, setLastOpen] = useState(false)
  const [bursts, setBursts] = useState<Burst[]>([])
  const [muted, setMuted] = useState(true)
  const [musicAvailable, setMusicAvailable] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [typed, setTyped] = useState('')
  const letterText = config.letter
  const [starsFound, setStarsFound] = useState<number[]>([])
  const [activePhoto, setActivePhoto] = useState<number | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBursts(prev => prev.length > 8 ? prev.slice(-6) : prev)
    }, 1500)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!letterOpen) { setTyped(''); return }
    let i = 0
    const timer = window.setInterval(() => {
      i += 2
      setTyped(letterText.slice(0, i))
      if (i >= letterText.length) window.clearInterval(timer)
    }, 18)
    return () => window.clearInterval(timer)
  }, [letterOpen, letterText])

  const burst = (x: number, y: number) => {
    const id = Date.now() + Math.random()
    setBursts(prev => [...prev, { id, x, y, hue: [38, 326, 270, 48][Math.floor(Math.random() * 4)] }])
    window.setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 1700)
  }
  const enter = async () => {
    setEntered(true)
    if (audioRef.current) {
      try { await audioRef.current.play(); setMuted(false); setMusicAvailable(true) }
      catch { setMuted(true) }
    }
    burst(window.innerWidth / 2, window.innerHeight / 2)
  }
  const toggleMusic = async () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) { try { await audioRef.current.play(); setMuted(false) } catch { setMuted(true) } }
    else { audioRef.current.pause(); setMuted(true) }
  }
  const pickFortune = () => setFortune(config.wishes[Math.floor(Math.random() * config.wishes.length)])
  const onSkyClick = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    burst(e.clientX - rect.left, e.clientY - rect.top)
  }

  return <main>
    <audio ref={audioRef} src={config.musicSrc} loop onCanPlay={() => setMusicAvailable(true)} onError={() => setMusicAvailable(false)} />
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <div className="grain" />
    <AnimatePresence>
      {!entered && <motion.section className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }} transition={{ duration: 1 }} onClick={onSkyClick}>
        <div className="starscape">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 92}%`, animationDelay: `${(i % 7) * -.4}s` }} />)}</div>
        <div className="intro-moon" />
        <div className="intro-content">
          <span className="eyebrow"><span /> A LITTLE WORLD, JUST FOR YOU <span /></span>
          <div className="hero-diya-wrap"><Diya lit onClick={e => { e.stopPropagation(); enter() }} /></div>
          <motion.p className="intro-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }}>A little light. A little magic. A lot of love.</motion.p>
          <h1>{config.greeting}</h1>
          <p className="intro-sub">I made a tiny Diwali universe with you in mind.</p>
          <button className="gold-button" onClick={e => { e.stopPropagation(); enter() }}>Enter your little world <Sparkles size={16} /></button>
          <span className="scroll-hint">A surprise is waiting <ChevronDown size={14} /></span>
        </div>
        <div className="intro-bottom">MADE WITH A LITTLE EXTRA LOVE <Heart size={11} fill="currentColor" /></div>
      </motion.section>}
    </AnimatePresence>

    {entered && <>
      <header className="topbar">
        <a className="brand" href="#home"><span className="brand-mark">✦</span> DIWALI <em>WONDERLAND</em></a>
        <div className="top-actions"><span className="for-you">MADE FOR {config.herName.toUpperCase()}</span><button className="icon-button" onClick={toggleMusic} aria-label="Toggle music">{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button></div>
      </header>

      <section id="home" className="hero" onClick={onSkyClick}>
        <div className="hero-stars">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ left: `${(i * 29) % 100}%`, top: `${(i * 47) % 85}%`, animationDelay: `${i % 5}s` }} />)}</div>
        <div className="hero-moon" />
        <div className="lantern lantern-a">✧</div><div className="lantern lantern-b">✧</div>
        <div className="hero-copy">
          <span className="eyebrow"><span /> THIS FESTIVAL, A WISH FROM MY HEART <span /></span>
          <h1>For you, <em>{config.herName}.</em></h1>
          <p>May every little light tonight remind you how much brightness you bring into this world.</p>
          <a className="text-link" href="#diya">LET THE MAGIC BEGIN <span>↓</span></a>
        </div>
        <div className="hero-floor"><Diya lit onClick={() => burst(window.innerWidth / 2, window.innerHeight - 100)} small /><Diya lit onClick={() => burst(window.innerWidth / 2 - 70, window.innerHeight - 100)} small /><Diya lit onClick={() => burst(window.innerWidth / 2 + 70, window.innerHeight - 100)} small /></div>
        <div className="hero-caption">A FESTIVAL OF LIGHTS · A WISH MADE JUST FOR YOU</div>
      </section>

      <section id="diya" className="section diya-section">
        <SectionTitle eyebrow="01 · A LITTLE LIGHT FOR YOU" title="Light a wish" subtitle="Tap each diya and let a little wish glow just for you." />
        <div className="diya-grid">
          {config.wishes.slice(0, 6).map((wish, i) => <motion.div className="diya-item" key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Diya lit={lit.includes(i)} onClick={() => { setLit(prev => prev.includes(i) ? prev : [...prev, i]); burst(window.innerWidth / 2 + (i - 2) * 40, window.innerHeight / 2) }} />
            <p className={lit.includes(i) ? 'wish-visible' : ''}>{lit.includes(i) ? wish : 'Tap to light'}</p>
          </motion.div>)}
        </div>
        <div className="progress-note">{lit.length} of 6 wishes glowing <span className="progress-track"><i style={{ width: `${lit.length / 6 * 100}%` }} /></span></div>
      </section>

      <section className="fireworks-section" onClick={onSkyClick}>
        <div className="firework-copy">
          <span className="eyebrow"><span /> 02 · MAKE A WISH <span /></span>
          <h2>A sky full<br /><em>of wishes.</em></h2>
          <p>Tap anywhere in this night sky. Every spark carries a little wish for you.</p>
          <span className="tap-note"><Sparkles size={14} /> TAP THE SKY TO MAKE MAGIC</span>
        </div>
        <div className="fireworks-hint">✦ &nbsp; YOUR WISHES, IN LIGHT &nbsp; ✦</div>
      </section>

      <section className="letter-section section">
        <SectionTitle eyebrow="03 · SOMETHING FROM THE HEART" title="A letter, just for you" subtitle="Some wishes are better when they're written down." />
        <motion.button className={`envelope ${letterOpen ? 'opened' : ''}`} onClick={() => setLetterOpen(!letterOpen)} whileHover={{ y: -5 }} whileTap={{ scale: .98 }}>
          <div className="envelope-flap" /><div className="envelope-paper"><span className="script">For {config.herName}</span><Heart fill="currentColor" size={19} /></div>
          <div className="envelope-front"><span>OPEN WITH LOVE</span><Heart size={17} fill="currentColor" /></div>
        </motion.button>
        <p className="envelope-hint">{letterOpen ? 'A little note from me, to you.' : 'Someone has a little something to tell you…'}</p>
        <AnimatePresence>
          {letterOpen && (
            <motion.div
              className="letter-paper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div className="letter-ornament">✧ &nbsp; WITH LOVE &nbsp; ✧</div>
              <div className="letter-body-stack" aria-live="polite">
                <p className="letter-body letter-body-measure" aria-hidden="true">{letterText}</p>
                <p className="letter-body">{typed}</p>
              </div>
              <div className="letter-sign">
                Always, <span>{config.yourName}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="memory-section section">
        <SectionTitle eyebrow="04 · LITTLE MOMENTS, BIG FEELINGS" title="A few moments to keep" subtitle="The best memories are made of the smallest things." />
        <div className="memory-grid">
          {config.memories.map((photo, i) => <motion.button className={`polaroid polaroid-${i + 1}`} key={i} onClick={() => photo.src ? setActivePhoto(i) : undefined} whileHover={{ y: -10, rotate: 0 }} initial={{ opacity: 0, y: 30, rotate: (i - 1) * 3 }} whileInView={{ opacity: 1, y: 0, rotate: (i - 1) * 3 }} viewport={{ once: true }}>
            <div className="photo-frame">{photo.src ? <img src={photo.src} alt={photo.caption} /> : <div className="photo-placeholder"><span>✧</span><small>YOUR MEMORY<br />GOES HERE</small></div>}</div>
            <span className="photo-caption">{photo.caption}</span>
          </motion.button>)}
        </div>
        {config.memories.some((m) => !m.src) && (
          <p className="memory-tip">Add your favourite photos in <code>src/config.ts</code> and place image files in <code>public/memories/</code>.</p>
        )}
      </section>

      <section className="rangoli-section section">
        <SectionTitle eyebrow="05 · A PATTERN OF GOOD THINGS" title="A little rangoli magic" subtitle="A little colour, a little sparkle, and a wish tucked in the middle." />
        <button className={`rangoli ${rangoli ? 'rangoli-active' : ''}`} onClick={() => { setRangoli(!rangoli); burst(window.innerWidth / 2, window.innerHeight / 2) }} aria-label="Activate rangoli">
          <div className="rangoli-ring ring-one" /><div className="rangoli-ring ring-two" /><div className="rangoli-ring ring-three" />
          {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 30}deg) translateY(-78px)` }} />)}
          <span className="rangoli-centre">✦</span>
        </button>
        <p className={`rangoli-message ${rangoli ? 'show' : ''}`}>{rangoli ? 'May your life bloom with colour, wonder, and endless reasons to smile. ❤️' : 'Tap the rangoli to reveal a hidden wish.'}</p>
      </section>

      <section className="fortune-section section">
        <SectionTitle eyebrow="06 · A LITTLE FORTUNE" title="A wish from the universe" subtitle="Close your eyes, make a wish, and open your little fortune." />
        <button className="fortune-orb" onClick={pickFortune}><span className="orb-halo" /><Stars size={34} /><small>REVEAL<br />YOUR WISH</small></button>
        <AnimatePresence mode="wait">{fortune && <motion.div className="fortune-message" key={fortune} initial={{ opacity: 0, y: 12, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}><span>✧ A NOTE FOR YOU ✧</span><p>“{fortune}”</p><button className="quiet-button" onClick={pickFortune}>Another little wish ↗</button></motion.div>}</AnimatePresence>
      </section>

      <section className="final-section" onClick={onSkyClick}>
        <div className="final-moon" /><div className="final-stars">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ left: `${(i * 31) % 100}%`, top: `${(i * 53) % 80}%` }} />)}</div>
        <motion.div className="final-copy" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="eyebrow"><span /> 07 · THE LAST LITTLE SURPRISE <span /></span>
          <div className="final-heart"><Heart fill="currentColor" /></div>
          <h2>{config.finalMessage}</h2>
          <p className="happy-diwali">HAPPY DIWALI, BEAUTIFUL.</p>
          <p className="final-name">{config.herName} <span>✧</span></p>
          <button className="gold-button" onClick={() => setLastOpen(true)}>One last surprise <Gift size={16} /></button>
          <AnimatePresence>{lastOpen && <motion.div className="last-note" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }}>
            <button className="close-note" onClick={() => setLastOpen(false)}><X size={16} /></button>
            <span className="script">Just for you, {config.herName}…</span>
            <p>In a sky full of lights, I’d still look for the one that feels like home. Thank you for being you. I hope this Diwali brings you the kind of happiness that stays long after the lights fade.</p>
            <strong>Happy Diwali ❤️</strong><small>— {config.yourName}</small>
          </motion.div>}</AnimatePresence>
        </motion.div>
        <div className="final-diyas"><Diya lit onClick={() => burst(window.innerWidth / 2, window.innerHeight - 70)} small /><Diya lit onClick={() => burst(window.innerWidth / 2 - 100, window.innerHeight - 70)} small /><Diya lit onClick={() => burst(window.innerWidth / 2 + 100, window.innerHeight - 70)} small /></div>
      </section>

      <footer><span>MADE WITH LOVE & A LITTLE MAGIC</span><Heart size={12} fill="currentColor" /><span>FOR {config.herName.toUpperCase()}</span></footer>
      <button className="floating-music" onClick={toggleMusic} aria-label="Toggle music"><Music2 size={16} />{muted ? 'Sound off' : 'Sound on'}</button>
      {!musicAvailable && <span className="music-note">Add your own MP3 at <code>public/music.mp3</code> for music.</span>}
    </>}

    <div className="burst-layer" aria-hidden="true">{bursts.map(b => <div key={b.id} className="burst" style={{ left: b.x, top: b.y, ['--hue' as string]: b.hue } as CSSProperties}>{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 20}deg) translateY(-${30 + (i % 4) * 13}px)` }} />)}</div>)}</div>
    <AnimatePresence>{activePhoto !== null && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActivePhoto(null)}><button><X /></button><img src={config.memories[activePhoto].src} alt={config.memories[activePhoto].caption} /></motion.div>}</AnimatePresence>
  </main>
}

export default App