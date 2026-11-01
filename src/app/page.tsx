import Image from "next/image";
import { Cursor, SmoothScroll, Split } from "@/components/FX";
import { BackButton } from "@/components/Nav";
import { AboutPortrait, Comparisons, ContactForm, Faq, Header, Hero, Portfolio, Services, Testimonials, Trust, Videos } from "@/components/Site";
import { IconInstagram, IconWhatsapp } from "@/components/Icons";
import { nav, stats, studio } from "@/lib/data";
import { asset } from "@/lib/base-path";
import { wrap } from "@/lib/ui";

function Head({ chip, title, text, center = true }: { chip: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      <span className="chip">{chip}</span>
      <Split text={title} className={`t-display t-h1 mt-4 ${center ? "mx-auto" : ""} max-w-[40rem]`} />
      {text && <p className={`mt-3 max-w-[34rem] text-[0.98rem] text-cream/80 ${center ? "mx-auto" : ""}`}>{text}</p>}
    </div>
  );
}

const areas = [
  { t: "Projeto arquitetônico", d: "Da implantação no lote à fachada, pensado para a rotina e para o valor do imóvel." },
  { t: "Projetos complementares", d: "Estrutural, hidráulico, sanitário e elétrico conversando com o arquitetônico." },
  { t: "Engenharia diagnóstica", d: "Trincas, infiltrações e falhas de execução: causa, laudo e solução." },
];

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <BackButton />
      <Header />
      <main>
        <Hero />

        <section className="py-14 md:py-20">
          <div className={wrap}>
            <Trust stats={stats} />
          </div>
        </section>

        <section id="portfolio" data-title="Portfólio" className="py-16 md:py-24">
          <div className={wrap}>
            <Head chip="Portfólio" title="Projetos que saíram do papel" text="Casas executadas, empreendimentos para venda e projetos autorais. Clique para ver todas as fotos e os vídeos." />
            <Portfolio />
          </div>
        </section>

        <section id="execucao" data-title="Projeto x Obra" className="tone-light bg-night py-16 md:py-24">
          <div className={wrap}>
            <Head chip="Projeto x Obra" title="O que foi desenhado é o que foi construído" text="Render e casa pronta, lado a lado. As imagens alternam sozinhas; clique para comparar no seu ritmo." />
            <Comparisons />
          </div>
        </section>

        <section id="servicos" data-title="Serviços" className="py-16 md:py-24">
          <div className={wrap}>
            <Head chip="Serviços" title="Engenharia que resolve" text="Do primeiro traço à vistoria de recebimento. Passe o mouse (ou toque) em cada serviço." />
            <Services />
          </div>
        </section>

        <section id="sobre" data-title="Sobre" className="py-16 md:py-24">
          <div className={wrap}>
            <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
              <AboutPortrait />
              <div>
                <span className="chip">Sobre</span>
                <h2 className="t-display mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">Olá, eu sou a Mirllém.</h2>
                <div className="mt-5 space-y-4 leading-relaxed text-cream/85">
                  <p>Sou engenheira civil em Juazeiro do Norte, no Cariri cearense. Projeto casas, acompanho obras financiadas e faço perícias e laudos para quem quer construir com segurança, identidade e propósito.</p>
                  <p>No Instagram, explico em vídeos curtos o que a lei e a técnica dizem sobre muro, janela, telhado e vizinho. Mais de 70 mil pessoas acompanham, e alguns vídeos passaram de 3 milhões de visualizações.</p>
                </div>
                <p className="t-display mt-8 text-[1rem]">Como eu trabalho</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {areas.map((a, i) => (
                    <div key={a.t} className={`window p-4 transition-colors hover:border-gold/50 ${i === 2 ? "sm:col-span-2" : ""}`}>
                      <p className="flex items-center gap-2 font-semibold">
                        <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-gold/15 text-[0.7rem] text-gold">0{i + 1}</span>
                        {a.t}
                      </p>
                      <p className="mt-1.5 text-[0.88rem] text-cream/75">{a.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="videos" data-title="Vídeos" className="py-16 md:py-24">
          <div className={wrap}>
            <Head chip="Vídeos" title="Engenharia explicada em 1 minuto" text="Os vídeos mais vistos do perfil e os tours das obras. Passe o mouse para ver a prévia; clique para assistir com som." />
            <Videos />
          </div>
        </section>

        <section id="depoimentos" data-title="Depoimentos" className="py-16 md:py-24">
          <div className={wrap}>
            <Head chip="Depoimentos" title="Quem viu a obra pronta" text="Comentários reais nas publicações dos projetos." />
            <Testimonials />
          </div>
        </section>

        <section id="perguntas" data-title="Perguntas" className="py-16 md:py-24">
          <div className={`${wrap} grid gap-10 md:grid-cols-[1fr_1.5fr]`}>
            <Head chip="Perguntas" title="Antes de começar" center={false} />
            <Faq />
          </div>
        </section>

        <section id="contato" data-title="Contato" className="pb-20 pt-16 md:pb-28 md:pt-24">
          <div className={wrap}>
            <Head chip="Contato" title="Vamos tirar a sua obra do papel?" text="Preencha e a mensagem abre pronta no WhatsApp. Sem complicação." />
            <div className="mx-auto max-w-[44rem]">
              <ContactForm />
              <div className="mt-8 flex justify-center gap-2">
                <a href={studio.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-gold hover:text-gold">
                  <IconInstagram className="h-4 w-4" />
                </a>
                <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-gold hover:text-gold">
                  <IconWhatsapp className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className={`${wrap} grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]`}>
          <div>
            <div className="flex items-center gap-2.5">
              <Image src={asset("/img/logo-dourado.png")} alt="Monograma MT de Mirllém Tássia" width={36} height={34} unoptimized className="h-8 w-auto" />
              <span className="t-display">MIRLLÉM TÁSSIA</span>
            </div>
            <p className="mt-3 max-w-[22rem] text-[0.9rem] text-cream/75">Arquitetura & Engenharia Aplicada. Obra sem complicação.</p>
          </div>
          <nav aria-label="Rodapé">
            <p className="text-[0.75rem] text-cream/65">Navegue</p>
            <ul className="mt-3 grid grid-cols-2 gap-1.5 text-[0.9rem]">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-gold">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[0.75rem] text-cream/65">Contato</p>
            <p className="mt-3 text-[0.9rem]">
              <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                WhatsApp {studio.whatsappLabel}
              </a>
            </p>
            <p className="mt-1 text-[0.9rem] text-cream/75">{studio.city} · {studio.region}</p>
          </div>
        </div>
        <div className={`${wrap} flex flex-wrap justify-between gap-3 border-t border-line py-5 text-[0.78rem] text-cream/65`}>
          <p>© 2026 Mirllém Tássia</p>
          <a href="#inicio" className="hover:text-cream">
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
    </>
  );
}
