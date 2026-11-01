"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { comparisons, faq, nav, projects, services, studio, testimonials, videos, whatsappLink, workVideos, type Project } from "@/lib/data";
import { asset } from "@/lib/base-path";
import { wrap } from "@/lib/ui";
import { IconPlus, IconRight, IconWhatsapp } from "./Icons";
import { Magnetic } from "./FX";
import { useHistoryLayer } from "./Nav";

/* ---------- utilitários ---------- */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function useInView<T extends Element>(threshold = 0.2, once = true) {
  const ref = useRef<T>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (once) {
        if (e.isIntersecting) {
          setV(true);
          io.disconnect();
        }
      } else setV(e.isIntersecting);
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return [ref, v] as const;
}

/** Esc fecha, trava a rolagem e liga a janela ao histórico (voltar do celular fecha). */
function useLayer(open: boolean, close: () => void, extra?: (e: KeyboardEvent) => void) {
  useHistoryLayer(open, close);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      extra?.(e);
    };
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
      window.removeEventListener("keydown", k);
    };
  }, [open, close, extra]);
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-ghost py-2 text-[0.82rem]">
      ← Voltar
    </button>
  );
}

const posterOf = (slug: string) => `/img/reel-${slug}.webp`;
const fotos = (n: number) => `${n} ${n === 1 ? "foto" : "fotos"}`;

/* ---------- cabeçalho ---------- */
export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useLayer(open, close);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      if (y > 500 && y > last + 2) setHidden(true);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !open ? "-translate-y-full" : ""} ${solid || open ? "bg-night/95 shadow-[0_1px_0_var(--c-line)]" : ""}`}>
        <div className={`${wrap} flex h-[4.25rem] items-center justify-between gap-4`}>
          <a href="#inicio" data-no-back onClick={close} className="flex items-center gap-2.5">
            <Image src={asset("/img/logo-dourado.png")} alt="" width={30} height={29} unoptimized className="h-7 w-auto" />
            <span className="t-display text-[0.95rem] tracking-[0.02em]">MIRLLÉM TÁSSIA</span>
          </a>
          <nav className="hidden items-center gap-1 rounded-full border border-line bg-coal/60 p-1 lg:flex" aria-label="Menu principal">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-3.5 py-1.5 text-[0.82rem] text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Magnetic strength={0.2}>
              <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-gold max-sm:hidden">
                Iniciar projeto
              </a>
            </Magnetic>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="btn btn-ghost px-3 lg:hidden" aria-label={open ? "Fechar menu" : "Abrir menu"}>
              <span className="flex w-4 flex-col gap-[4px]">
                <span className={`h-px w-4 bg-current transition-transform ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
                <span className={`h-px w-4 bg-current transition-transform ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-40 bg-night transition-[clip-path] duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] lg:hidden ${open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"}`} aria-hidden={!open}>
        <nav className={`${wrap} flex h-full flex-col justify-center gap-1 pt-16`} aria-label="Menu do celular">
          {nav.map((n, i) => (
            <a key={n.href} href={n.href} tabIndex={open ? 0 : -1} onClick={close} className="t-display border-b border-line py-3 text-[1.7rem]" style={{ transition: `opacity .5s ${0.15 + i * 0.05}s, transform .5s ${0.15 + i * 0.05}s`, opacity: open ? 1 : 0, transform: open ? "none" : "translateY(16px)" }}>
              {n.label}
            </a>
          ))}
          <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="btn btn-gold mt-6 justify-center">
            <IconWhatsapp className="h-4 w-4" /> Falar no WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}

/* ---------- vídeo em janela (modal) ---------- */
function VideoModal({ slug, title, onClose }: { slug: string; title: string; onClose: () => void }) {
  useLayer(true, onClose);
  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-ink/96 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <CloseButton onClick={onClose} />
      </div>
      <video className="max-h-[82vh] w-auto max-w-full animate-[fadeUp_0.5s_both] rounded-[12px]" src={asset(`/video/${slug}.mp4`)} poster={asset(posterOf(slug))} autoPlay controls playsInline />
      <p className="text-[0.88rem] text-cream/80">{title}</p>
    </div>
  );
}

/* ---------- topo: retrato com brilho dourado e título ---------- */
export function Hero() {
  const [y, setY] = useState(0);
  const [m, setM] = useState({ x: 0, y: 0 });
  const [video, setVideo] = useState(false);
  const close = useCallback(() => setVideo(false), []);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(Math.min(window.scrollY, Math.round(window.innerHeight * 1.2))));
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const k = reduced() ? 0 : clamp(y / 800);
  const title = ["Onde o projeto", "vira obra", "sem complicação"];
  return (
    <section
      id="inicio"
      data-title="o início"
      className="relative min-h-[100svh] overflow-hidden"
      onPointerMove={(e) => e.pointerType === "mouse" && !reduced() && setM({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 })}
    >
      {/* brilho dourado que respira e segue o mouse */}
      <div className="pointer-events-none absolute left-[72%] top-[45%] h-[70vmax] w-[70vmax] animate-[glow_7s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(198,164,108,0.28),rgba(198,164,108,0.06)_45%,transparent_70%)]" style={{ marginLeft: m.x * 30, marginTop: m.y * 20 }} />
      {/* retrato: em obra, com café na mão */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[56%]" style={{ transform: `translateY(${k * 90}px)` }}>
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out" style={{ transform: `translate(${m.x * -10}px, ${m.y * -6}px) scale(1.04)` }}>
          <Image src={asset("/img/mirllem-obra.webp")} alt="Engenheira Mirllém Tássia na obra, com uma xícara de café" fill priority quality={88} sizes="(min-width: 768px) 56vw, 100vw" className="animate-[fadeUp_1.4s_both] object-cover object-[60%_25%] md:object-[50%_20%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/35 to-transparent max-md:bg-gradient-to-t max-md:from-night max-md:via-night/60 max-md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
      </div>

      <div className={`${wrap} relative flex min-h-[100svh] flex-col justify-end pb-14 pt-28 md:justify-center md:pb-0`} style={{ opacity: 1 - k * 1.2 }}>
        <p className="chip animate-[fadeUp_0.8s_0.3s_both]">Engenheira civil · Juazeiro do Norte, CE</p>
        <h1 className="t-display t-hero mt-5 max-w-[40rem]">
          {title.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span className={`block animate-[riseIn_1.1s_cubic-bezier(0.16,1,0.3,1)_both] ${i === 2 ? "bg-gradient-to-r from-[#e7cf9f] to-[#b8904f] bg-clip-text text-transparent" : ""}`} style={{ animationDelay: `${0.45 + i * 0.12}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-[30rem] animate-[fadeUp_1s_0.95s_both] text-[1rem] leading-relaxed text-cream/85">Arquitetura & engenharia aplicada: projetos, construção financiada, perícias e fachadas. Mais de 30 mil m² projetados no Cariri.</p>
        <div className="mt-8 flex animate-[fadeUp_1s_1.1s_both] flex-wrap gap-3">
          <Magnetic strength={0.2}>
            <a href="#portfolio" className="btn btn-gold">
              Ver portfólio <IconRight />
            </a>
          </Magnetic>
          <button type="button" onClick={() => setVideo(true)} className="btn btn-ghost group">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[0.6rem] text-ink transition-transform group-hover:scale-110">▶</span>
            Tour da Residência R|S
          </button>
        </div>
      </div>
      {video && <VideoModal slug="residencia-rs" title="Residência R|S" onClose={close} />}
    </section>
  );
}

/* ---------- confiança: faixa corrida + números ---------- */
export function Trust({ stats }: { stats: { value: string; suffix: string; label: string }[] }) {
  const [ref, v] = useInView<HTMLDivElement>(0.3);
  const words = ["Projetos residenciais", "Construção financiada", "Perícias", "Fachadas", "Engenharia diagnóstica", "Juazeiro do Norte", "Crato", "Cariri"];
  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="text-[0.85rem] text-cream/75">Quem constrói com a Mirllém:</p>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-8">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 gap-8">
                {words.map((w) => (
                  <span key={w} className="flex items-center gap-2 whitespace-nowrap text-[0.95rem] text-cream/80">
                    <span className="text-gold">◆</span> {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="window group p-5 transition-all duration-700 hover:-translate-y-1 hover:border-gold/50" style={{ transitionDelay: v ? `${i * 90}ms` : "0ms", opacity: v ? 1 : 0, transform: v ? undefined : "translateY(24px)" }}>
            <p className="t-display text-[clamp(1.7rem,2.8vw,2.3rem)]">
              {s.value}
              <span className="text-gold">{s.suffix}</span>
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-[0.85rem] text-cream/75">{s.label}</p>
              <span className="text-gold transition-transform duration-500 group-hover:translate-x-1">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- portfólio: janelas de projeto com filtros ---------- */
const cats = ["Todos", "Executado", "Empreendimento", "Projeto"] as const;

export function Portfolio() {
  const [cat, setCat] = useState<(typeof cats)[number]>("Todos");
  const [open, setOpen] = useState<{ p: string; m: number } | null>(null);
  const list = cat === "Todos" ? projects : projects.filter((p) => p.kind === cat);
  return (
    <>
      <div className="mb-8 flex justify-center">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-coal/60 p-1" role="tablist" aria-label="Filtrar projetos">
          {cats.map((c) => {
            const n = c === "Todos" ? projects.length : projects.filter((p) => p.kind === c).length;
            return (
              <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-[0.85rem] transition-colors ${cat === c ? "bg-gold text-ink" : "text-cream/80 hover:text-cream"}`}>
                {c} <span className="opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {list.map((p, i) => (
          <ProjectWindow key={`${cat}-${p.slug}`} p={p} i={i} big={i === 0 && cat === "Todos"} wide={cat === "Todos" && i === list.length - 1} onOpen={(m) => setOpen({ p: p.slug, m })} />
        ))}
      </div>
      {open && <ProjectViewer slug={open.p} start={open.m} onClose={() => setOpen(null)} />}
    </>
  );
}

function ProjectWindow({ p, i, big, wide = false, onOpen }: { p: Project; i: number; big: boolean; wide?: boolean; onOpen: (m: number) => void }) {
  const [ref, v] = useInView<HTMLButtonElement>(0.15);
  const vid = useRef<HTMLVideoElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  // no destaque, o tour toca sozinho (sem som) enquanto está na tela
  useEffect(() => {
    const el = vid.current;
    if (!el || reduced()) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const second = p.gallery[1];
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(0)}
      data-cursor="Ver projeto"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className={`window group text-left [perspective:1200px] transition-[opacity,transform,border-color] duration-700 hover:border-gold/50 ${big ? "md:col-span-2 md:row-span-2" : ""} ${wide ? "md:col-span-3" : ""}`}
      style={{ transitionDelay: v ? `${(i % 3) * 90}ms` : "0ms", opacity: v ? 1 : 0, transform: v ? `rotateY(${tilt.x * 2.5}deg) rotateX(${tilt.y * -2.5}deg)` : "translateY(30px)" }}
      aria-label={`Ver projeto: ${p.title}`}
    >
      {/* barra de janela */}
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-[#ec6765]" />
          <span className="h-2 w-2 rounded-full bg-[#f2c942]" />
          <span className="h-2 w-2 rounded-full bg-[#65c466]" />
        </span>
        <span className="ml-1 truncate text-[0.72rem] text-cream/70">{p.place}</span>
        <span className="ml-auto shrink-0 rounded-full border border-line px-2 py-0.5 text-[0.68rem] text-cream/80">{p.kind}</span>
      </div>
      <div className={`relative overflow-hidden ${big ? "aspect-[4/3] md:aspect-auto md:h-[calc(100%-6.6rem)]" : wide ? "aspect-[4/3] md:aspect-[21/8]" : "aspect-[4/3]"}`}>
        <Image src={asset(p.cover)} alt={`${p.title}, ${p.place}`} fill quality={88} sizes={big ? "(min-width: 768px) 780px, 100vw" : wide ? "(min-width: 768px) 1160px, 100vw" : "(min-width: 768px) 390px, 100vw"} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
        {big && p.video ? (
          <video ref={vid} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 md:opacity-100" src={asset(`/video/${p.video}-preview.mp4`)} poster={asset(posterOf(p.video))} muted loop playsInline preload="none" aria-hidden />
        ) : (
          second && <Image src={asset(second)} alt="" fill quality={85} sizes="(min-width: 768px) 390px, 100vw" className="object-cover opacity-0 transition-opacity duration-700 max-md:hidden md:group-hover:opacity-100" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.72rem] text-blush">{p.tag}</span>
        <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.72rem] tabular-nums text-blush">
          {p.area ?? fotos(p.gallery.length)}
          {p.video ? " · vídeo" : ""}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-3.5 py-3">
        <div>
          <p className={`t-display ${big ? "text-[1.35rem]" : "text-[1.02rem]"}`}>{p.title}</p>
          <p className="text-[0.8rem] text-cream/70">{fotos(p.gallery.length)}{p.video ? " + vídeo" : ""}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:-rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
          <IconRight />
        </span>
      </div>
    </button>
  );
}

/** Tela cheia: fotos + vídeo do projeto, com informações recolhíveis. */
function ProjectViewer({ slug, start, onClose }: { slug: string; start: number; onClose: () => void }) {
  const p = projects.find((x) => x.slug === slug)!;
  const media: ({ t: "img"; src: string } | { t: "video"; slug: string })[] = [...p.gallery.map((src) => ({ t: "img" as const, src })), ...(p.video ? [{ t: "video" as const, slug: p.video }] : [])];
  const [i, setI] = useState(start);
  const [info, setInfo] = useState(false);
  const total = p.gallery.length + (p.video ? 1 : 0);
  const go = useCallback((d: number) => setI((v) => (v + d + total) % total), [total]);
  const keys = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    },
    [go],
  );
  useLayer(true, onClose, keys);
  const swipe = useRef<number | null>(null);
  const cur = media[i];
  return (
    <div className="fixed inset-0 z-[70] flex animate-[fadeUp_0.4s_both] flex-col bg-ink text-blush" role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="flex items-center justify-between gap-3 p-3 md:p-4">
        <CloseButton onClick={onClose} />
        <p className="truncate text-[0.95rem]">
          <span className="t-display">{p.title}</span> <span className="text-blush/70">· {String(i + 1).padStart(2, "0")}/{String(media.length).padStart(2, "0")}</span>
        </p>
        <button type="button" onClick={() => setInfo((v) => !v)} className="btn btn-ghost py-2 text-[0.82rem]" aria-expanded={info}>
          {info ? "Fechar info" : "Sobre o projeto"}
        </button>
      </div>
      <div
        className="relative flex-1 touch-pan-y"
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 50 && cur.t === "img") go(dx < 0 ? 1 : -1);
        }}
      >
        {cur.t === "img" ? (
          <div key={cur.src} className="absolute inset-0 animate-[fadeUp_0.4s_both]">
            <Image src={asset(cur.src)} alt={`${p.title}: foto ${i + 1}`} fill unoptimized sizes="100vw" className="object-contain" />
          </div>
        ) : (
          <video key={cur.slug} className="absolute inset-0 m-auto max-h-full max-w-full animate-[fadeUp_0.4s_both]" src={asset(`/video/${cur.slug}.mp4`)} poster={asset(posterOf(cur.slug))} autoPlay controls playsInline />
        )}
        <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 rotate-180 items-center justify-center rounded-full border border-blush/40 bg-ink/70 hover:bg-gold hover:text-ink" aria-label="Anterior">
          <IconRight />
        </button>
        <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-blush/40 bg-ink/70 hover:bg-gold hover:text-ink" aria-label="Próximo">
          <IconRight />
        </button>
        <aside className={`absolute bottom-0 right-0 top-0 w-full max-w-[24rem] overflow-y-auto border-l border-blush/10 bg-[#1a1715]/95 p-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${info ? "translate-x-0" : "translate-x-full"}`} aria-hidden={!info}>
          <span className="chip">{p.kind}</span>
          <h3 className="t-display mt-4 text-[1.8rem]">{p.title}</h3>
          <p className="mt-1 text-blush/75">
            {p.place}
            {p.area ? ` · ${p.area}` : ""}
          </p>
          <p className="mt-5 leading-relaxed text-blush/90">{p.text}</p>
          {p.facts && (
            <ul className="mt-5 space-y-1.5 border-t border-blush/15 pt-5 text-[0.95rem]">
              {p.facts.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-gold">◆</span>
                  {f}
                </li>
              ))}
            </ul>
          )}
          {p.credit && <p className="mt-4 text-[0.82rem] text-blush/70">{p.credit}</p>}
          <a href={whatsappLink(`Olá, Mirllém! Vi o projeto ${p.title} no site e quero algo parecido.`)} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-6">
            Quero um projeto assim
          </a>
        </aside>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto p-3 md:p-4 [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto">
        {media.map((m, k) => (
          <button key={k} type="button" onClick={() => setI(k)} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-[6px] transition-opacity ${k === i ? "opacity-100 ring-2 ring-gold" : "opacity-50 hover:opacity-90"}`} aria-label={m.t === "img" ? `Foto ${k + 1}` : "Vídeo"}>
            <Image src={asset(m.t === "img" ? m.src : posterOf(m.slug))} alt="" fill quality={60} sizes="80px" className="object-cover" />
            {m.t === "video" && <span className="absolute inset-0 flex items-center justify-center bg-ink/40">▶</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- projeto x obra: alternador com cortina ---------- */
export function Comparisons() {
  const [t, setT] = useState(0);
  const [after, setAfter] = useState(false);
  useEffect(() => {
    if (reduced()) return;
    const id = setTimeout(() => setAfter((v) => !v), after ? 3600 : 2600);
    return () => clearTimeout(id);
  }, [after, t]);
  return (
    <div className="grid gap-4 md:grid-cols-[1.15fr_1fr]">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-coal md:aspect-[5/6]" onClick={() => setAfter((v) => !v)} data-cursor={after ? "Ver projeto" : "Ver obra"}>
          {comparisons.map((x, i) => (
            <div key={x.slug} className={`absolute inset-0 transition-opacity duration-500 ${i === t ? "opacity-100" : "opacity-0"}`}>
              <Image src={asset(x.before)} alt={`${x.title}: projeto (render)`} fill quality={90} sizes="(min-width: 768px) 620px, 100vw" className="object-cover" />
              <div className="absolute inset-0 transition-[clip-path] duration-[1.1s] ease-[cubic-bezier(0.77,0,0.18,1)]" style={{ clipPath: i === t && after ? "inset(0 0 0 0)" : "inset(0 0 0 100%)" }}>
                <Image src={asset(x.after)} alt={`${x.title}: obra pronta`} fill quality={90} sizes="(min-width: 768px) 620px, 100vw" className="object-cover" />
              </div>
            </div>
          ))}
          <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-[0.78rem] text-blush">{after ? "Obra pronta" : "Projeto (render)"}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="grid grid-cols-2 rounded-full border border-line p-1" role="tablist" aria-label="Comparar">
            {[false, true].map((a) => (
              <button key={String(a)} type="button" role="tab" aria-selected={after === a} onClick={() => setAfter(a)} className={`rounded-full px-4 py-1.5 text-[0.82rem] transition-colors ${after === a ? "bg-ink text-blush" : ""}`}>
                {a ? "Obra" : "Projeto"}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {comparisons.map((x, i) => (
              <button key={x.slug} type="button" onClick={() => (setT(i), setAfter(false))} className={`rounded-full border px-3 py-1.5 text-[0.82rem] transition-colors ${i === t ? "border-ink bg-ink text-blush" : "border-line"}`}>
                {x.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="relative min-h-[18rem] flex-1 overflow-hidden rounded-[14px]">
          <Image src={asset("/img/crato-0.webp")} alt="O projeto impresso na mão, em frente à casa pronta em Crato" fill quality={90} sizes="(min-width: 768px) 520px, 100vw" className="object-cover" />
          <span className="absolute bottom-3 left-3 right-3 rounded-[10px] bg-ink/75 p-3 text-[0.85rem] text-blush">Casa em Crato: o projeto na mão, a casa de pé. &quot;E nela mora uma família muito especial.&quot;</span>
        </div>
        <p className="text-[1rem] leading-relaxed">
          Fidelidade de linhas, volumetria respeitada e cada detalhe saindo do papel com precisão de obra. Seguir o projeto evita erros simples que viram dor de cabeça depois.
        </p>
      </div>
    </div>
  );
}

/* ---------- serviços: linhas que abrem com vídeo ---------- */
export function Services() {
  const [open, setOpen] = useState(0);
  return (
    <div className="border-t border-line">
      {services.map((s, i) => (
        <ServiceRow key={s.title} s={s} i={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
      ))}
    </div>
  );
}

function ServiceRow({ s, i, open, onToggle }: { s: (typeof services)[number]; i: number; open: boolean; onToggle: () => void }) {
  const vid = useRef<HTMLVideoElement>(null);
  // o vídeo do serviço aberto só toca (e só baixa) quando está na tela
  const [ref, inView] = useInView<HTMLDivElement>(0.3, false);
  useEffect(() => {
    const el = vid.current;
    if (!el) return;
    if (open && inView && !reduced()) el.play().catch(() => {});
    else el.pause();
  }, [open, inView]);
  return (
    <div ref={ref} className="border-b border-line">
      <button type="button" onClick={onToggle} onMouseEnter={() => !open && onToggle()} aria-expanded={open} className="group grid w-full grid-cols-[2.2rem_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[2.6rem_15rem_1fr_auto]">
        <span className="t-display text-[0.9rem] text-gold">0{i + 1}</span>
        <span>
          <span className="t-display t-h3 block transition-transform duration-500 group-hover:translate-x-1.5">{s.title}</span>
          <span className="block text-[0.8rem] text-cream/70">{s.sub}</span>
        </span>
        <span className="hidden text-[0.92rem] leading-relaxed text-cream/80 md:block">{s.text}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-500 ${open ? "rotate-45 border-gold bg-gold text-ink" : ""}`}>
          <IconPlus />
        </span>
      </button>
      <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="grid gap-4 pb-6 md:grid-cols-[2.6rem_15rem_1fr] md:gap-4">
            <span className="hidden md:block" />
            <div className="relative aspect-[9/16] w-40 overflow-hidden rounded-[12px] bg-coal md:w-full">
              <video ref={vid} className="h-full w-full object-cover" src={asset(`/video/${s.video}-preview.mp4`)} poster={asset(posterOf(s.video))} muted loop playsInline preload="none" aria-hidden />
            </div>
            <div className="flex flex-col justify-between gap-4">
              <p className="leading-relaxed text-cream/85 md:hidden">{s.text}</p>
              <a href={whatsappLink(`Olá, Mirllém! Quero saber sobre: ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost self-start">
                Quero esse serviço <IconRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- vídeos: obras e engenharia que explica ---------- */
export function Videos() {
  const [tab, setTab] = useState<"obras" | "explica">("explica");
  const [open, setOpen] = useState<{ slug: string; title: string } | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const list = tab === "obras" ? workVideos.map((v) => ({ ...v, views: undefined as string | undefined })) : videos.map((v) => ({ ...v, credit: undefined as string | undefined }));
  return (
    <>
      <div className="mb-8 flex justify-center">
        <div className="flex gap-1 rounded-full border border-line bg-coal/60 p-1" role="tablist" aria-label="Tipo de vídeo">
          {(
            [
              ["explica", "Engenharia que explica"],
              ["obras", "Obras e tours"],
            ] as const
          ).map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 text-[0.85rem] transition-colors ${tab === k ? "bg-gold text-ink" : "text-cream/80 hover:text-cream"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:px-0">
        {list.map((x, i) => (
          <ReelCard key={`${tab}-${x.slug}`} x={x} i={i} onOpen={() => setOpen({ slug: x.slug, title: x.title })} />
        ))}
      </div>
      {open && <VideoModal slug={open.slug} title={open.title} onClose={close} />}
    </>
  );
}

function ReelCard({ x, i, onOpen }: { x: { slug: string; title: string; text: string; views?: string; credit?: string }; i: number; onOpen: () => void }) {
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = vid.current;
    if (!el || reduced() || window.matchMedia("(pointer: fine)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.7 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="Assistir"
      onPointerEnter={(e) => e.pointerType === "mouse" && vid.current?.play().catch(() => {})}
      onPointerLeave={() => vid.current?.pause()}
      className="window group w-[64%] shrink-0 animate-[fadeUp_0.6s_both] snap-start text-left md:w-auto"
      style={{ animationDelay: `${i * 70}ms` }}
      aria-label={`Assistir: ${x.title}`}
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        <video ref={vid} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={asset(`/video/${x.slug}-preview.mp4`)} poster={asset(posterOf(x.slug))} muted loop playsInline preload="none" />
        <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/30" />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-[0.68rem] text-blush">
          <span className="h-1.5 w-1.5 animate-[rec_1.4s_infinite] rounded-full bg-[#ec6765]" /> {x.views ? `${x.views} views` : "obra"}
        </span>
        <span className="absolute bottom-3 left-3 right-3 text-blush">
          <span className="t-display block text-[0.95rem] leading-tight">{x.title}</span>
          <span className="block text-[0.78rem] text-blush/80">{x.text}</span>
          {x.credit && <span className="block text-[0.7rem] text-blush/65">{x.credit}</span>}
        </span>
      </div>
    </button>
  );
}

/* ---------- depoimentos: "monitor" com abas ---------- */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  useEffect(() => {
    if (paused || reduced()) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), 6000);
    return () => clearTimeout(t);
  }, [i, paused, n]);
  const t = testimonials[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="mx-auto max-w-[44rem]">
      <div className="window relative overflow-hidden p-6 md:p-9">
        {testimonials.map((x, k) => (
          <div key={x.name} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden>
            <Image src={asset(x.image)} alt="" fill quality={70} sizes="700px" className="scale-110 object-cover opacity-25 blur-[2px]" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-coal/80 via-coal/70 to-coal" />
        {/* cantos de enquadramento, como no monitor da referência */}
        {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
          <span key={c} className={`absolute h-5 w-5 border-gold/70 ${c}`} aria-hidden />
        ))}
        <div className="relative">
          <div className="flex items-center justify-between text-[0.72rem] text-cream/70">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-[rec_1.4s_infinite] rounded-full bg-[#ec6765]" /> Comentário no Instagram
            </span>
            <span className="tabular-nums">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>
          <blockquote key={i} className="t-display mt-8 min-h-[6rem] text-[clamp(1.4rem,2.8vw,2.1rem)]">
            {`“${t.text}”`.split(" ").map((w, k) => (
              <span key={k} className="inline-block animate-[fadeUp_0.6s_both]" style={{ animationDelay: `${k * 45}ms` }}>
                {w}&nbsp;
              </span>
            ))}
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-full border border-gold/60">
              <Image src={asset(t.image)} alt="" fill quality={60} sizes="44px" className="object-cover" />
            </span>
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-[0.82rem] text-cream/70">Sobre: {t.where}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {testimonials.map((x, k) => (
          <button key={x.name} type="button" onClick={() => setI(k)} className={`relative shrink-0 overflow-hidden rounded-[10px] border px-3.5 py-2 text-[0.82rem] transition-colors ${k === i ? "border-gold text-cream" : "border-line text-cream/70 hover:text-cream"}`}>
            {x.name.split(",")[0].split(" ")[0]}
            {k === i && !paused && <span key={`p${i}`} className="absolute inset-x-0 bottom-0 h-[2px] origin-left animate-[fill_6s_linear_forwards] bg-gold" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- perguntas ---------- */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {faq.map((f, i) => (
        <div key={f.q} className="border-b border-line">
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="group flex w-full items-center justify-between gap-6 py-5 text-left">
            <span className="t-display text-[1.02rem] transition-transform duration-500 group-hover:translate-x-1.5">{f.q}</span>
            <span className={`transition-transform duration-500 ${open === i ? "rotate-45 text-gold" : ""}`}>
              <IconPlus />
            </span>
          </button>
          <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
            <div className="overflow-hidden">
              <p className="max-w-[40rem] pb-6 leading-relaxed text-cream/80">{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- contato ---------- */
const kinds = ["Projeto arquitetônico", "Construção financiada", "Perícia / laudo", "Fachada", "Outro"];
export function ContactForm() {
  const [f, setF] = useState({ nome: "", cidade: "", tipo: kinds[0], msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((v) => ({ ...v, [k]: e.target.value }));
  const field = "w-full border-b border-line bg-transparent py-3 text-[0.98rem] outline-none transition-colors placeholder:text-cream/50 focus:border-gold";
  return (
    <form
      className="grid gap-x-6 gap-y-1 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        window.open(whatsappLink(`Olá, Mirllém! Vim pelo site.\nNome: ${f.nome}\nCidade: ${f.cidade}\nServiço: ${f.tipo}\n${f.msg}`), "_blank", "noopener");
      }}
    >
      <label className="text-[0.78rem] text-cream/75">
        Nome
        <input required value={f.nome} onChange={set("nome")} placeholder="Seu nome" className={field} />
      </label>
      <label className="text-[0.78rem] text-cream/75">
        Cidade
        <input required value={f.cidade} onChange={set("cidade")} placeholder="Onde é a obra" className={field} />
      </label>
      <label className="text-[0.78rem] text-cream/75 md:col-span-2">
        Serviço
        <select value={f.tipo} onChange={set("tipo")} className={`${field} [&>option]:text-ink`}>
          {kinds.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </label>
      <label className="text-[0.78rem] text-cream/75 md:col-span-2">
        Mensagem
        <textarea value={f.msg} onChange={set("msg")} rows={3} placeholder="Tamanho do terreno, quantos quartos, prazo..." className={`${field} resize-none`} />
      </label>
      <div className="mt-6 flex justify-center md:col-span-2">
        <button type="submit" className="btn btn-gold w-full justify-center md:w-auto md:px-10">
          <IconWhatsapp className="h-4 w-4" /> Enviar pelo WhatsApp
        </button>
      </div>
    </form>
  );
}

/* ---------- retrato do "sobre": cantos de enquadramento e selo "em obra" ---------- */
export function AboutPortrait() {
  const [ref, v] = useInView<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-[14px] border border-line bg-coal">
      <div className="absolute inset-0 transition-[clip-path,transform] duration-[1.4s] ease-[cubic-bezier(0.77,0,0.18,1)]" style={{ clipPath: v || reduced() ? "inset(0 0 0 0)" : "inset(100% 0 0 0)", transform: v ? "none" : "scale(1.15)" }}>
        <Image src={asset("/img/mirllem-andando.webp")} alt="Mirllém Tássia caminhando por uma obra" fill quality={88} sizes="(min-width: 768px) 460px, 100vw" className="object-cover object-[50%_35%]" />
      </div>
      {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
        <span key={c} className={`absolute h-6 w-6 border-blush/80 ${c}`} aria-hidden />
      ))}
      <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1 text-[0.72rem] text-blush">
        <span className="h-1.5 w-1.5 animate-[rec_1.4s_infinite] rounded-full bg-[#ec6765]" /> Em obra
      </span>
    </div>
  );
}
