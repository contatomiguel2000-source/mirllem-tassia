// Conteúdo real: Instagram @eng.mirllemtassia (bio, legendas, comentários, destaques) e Linktree.
// Não há ficha própria dela no Google Maps.

const whatsappNumber = "5588996025840";

export const studio = {
  name: "Mirllém Tássia",
  role: "Arquitetura & Engenharia Aplicada",
  city: "Juazeiro do Norte, CE",
  region: "Cariri cearense",
  whatsappLabel: "(88) 99602-5840",
  whatsapp: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá, Mirllém! Vim pelo site e quero conversar sobre um projeto.")}`,
  instagram: "https://www.instagram.com/eng.mirllemtassia/",
};

export function whatsappLink(text: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { label: "Portfólio", href: "#portfolio" },
  { label: "Projeto x Obra", href: "#execucao" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Vídeos", href: "#videos" },
  { label: "Contato", href: "#contato" },
];

export const stats = [
  { value: "30", suffix: " mil m²+", label: "projetados" },
  { value: "70", suffix: " mil", label: "pessoas acompanham" },
  { value: "4,2", suffix: " mi", label: "views no vídeo mais visto" },
  { value: "10", suffix: "", label: "projetos neste portfólio" },
];

export type Project = {
  slug: string;
  title: string;
  kind: "Executado" | "Projeto" | "Empreendimento";
  tag: string;
  place: string;
  area?: string;
  cover: string;
  text: string;
  facts?: string[];
  gallery: string[];
  video?: string;
  credit?: string;
};

const g = (name: string, n: number) => Array.from({ length: n }, (_, i) => `/img/${name}-${i}.webp`);

export const projects: Project[] = [
  {
    slug: "residencia-rs",
    title: "Residência R|S",
    kind: "Executado",
    tag: "Duplex",
    place: "Juazeiro do Norte, CE",
    cover: "/img/rs-0.webp",
    text: "Um duplex que une sofisticação, conforto e funcionalidade. Cada ambiente foi pensado para oferecer beleza, praticidade e qualidade em cada detalhe: fachada em pedra e madeira, pé-direito duplo com escada em vidro e área de lazer com piscina.",
    facts: ["Duplex com pé-direito duplo", "Fachada em pedra natural e madeira", "Área gourmet integrada à piscina"],
    gallery: g("rs", 19),
    video: "residencia-rs",
  },
  {
    slug: "casa-bn",
    title: "Casa B & N",
    kind: "Executado",
    tag: "Térrea",
    place: "Juazeiro do Norte, CE",
    area: "225 m²",
    cover: "/img/bn-0.webp",
    text: "Casa térrea finalizada, com três amplas suítes, área gourmet, área de lazer e piscina, num terreno de 14 x 30 m.",
    facts: ["Terreno de 14 x 30 m", "225 m² construídos", "3 suítes, gourmet e piscina"],
    gallery: g("bn", 3),
  },
  {
    slug: "empreendimento-133",
    title: "Empreendimento 133",
    kind: "Empreendimento",
    tag: "Projeto x execução",
    place: "Juazeiro do Norte, CE",
    area: "133 m²",
    cover: "/img/emp133-0.webp",
    text: "Um projeto exclusivo, pensado para valorizar o imóvel, destacar no mercado e transformar fachada em desejo imediato. Arquitetura estratégica também é venda.",
    facts: ["Terreno de 220 m²", "133 m² construídos", "Projeto e casa pronta lado a lado"],
    gallery: g("emp133", 10),
  },
  {
    slug: "empreendimento-151",
    title: "Empreendimento 151",
    kind: "Empreendimento",
    tag: "Casa com piscina",
    place: "Juazeiro do Norte, CE",
    area: "151 m²",
    cover: "/img/emp151-0.webp",
    text: "Casa para venda nascida em 2023, com fachada marcante, garagem coberta e piscina nos fundos.",
    facts: ["Terreno de 220 m²", "Aprox. 151 m² construídos"],
    gallery: g("emp151", 5),
  },
  {
    slug: "venda-180",
    title: "Casa para venda 180",
    kind: "Empreendimento",
    tag: "Projeto autoral",
    place: "Bairro José Geraldo da Cruz",
    area: "180 m²",
    cover: "/img/venda180-0.webp",
    text: "Empreendimento para venda num lote longo, de 7 x 40 m: fachada contemporânea, piscina e área gourmet. Projeto meu, execução da Construtora Pride.",
    facts: ["Terreno de 300 m² (7 x 40 m)", "Aprox. 180 m² construídos"],
    gallery: g("venda180", 3),
    credit: "Execução: @construtora_pride e @pedroantonioaraujo_",
  },
  {
    slug: "casa-crato",
    title: "Casa em Crato",
    kind: "Executado",
    tag: "Projeto na mão, casa de pé",
    place: "Crato, CE",
    cover: "/img/crato-0.webp",
    text: "Projetar casas é bonito. Imaginar a vida acontecendo dentro delas é ainda mais gratificante. E nela mora uma família muito especial.",
    gallery: ["/img/crato-0.webp"],
  },
  {
    slug: "casa-tf",
    title: "Casa T&F",
    kind: "Projeto",
    tag: "Sobrado",
    place: "Crato, CE",
    cover: "/img/tf-0.webp",
    text: "Luz, volumes, materiais e cada detalhe pensados para uma casa que não passa despercebida, nem hoje, nem daqui a anos.",
    gallery: g("tf", 2),
  },
  {
    slug: "projeto-ss",
    title: "Projeto SS",
    kind: "Projeto",
    tag: "Neoclássico",
    place: "Crato, CE",
    cover: "/img/ss-0.webp",
    text: "Um dos projetos mais especiais do início da minha carreira, feito em 2021 para um casal cheio de sonhos e planos. Carregava propósito e emoção em cada ambiente.",
    facts: ["Estilo neoclássico", "Projetado em 2021"],
    gallery: g("ss", 7),
  },
  {
    slug: "casa-kariris",
    title: "Casa Cidade Kariris",
    kind: "Projeto",
    tag: "Térrea",
    place: "Cidade Kariris Residencial Club",
    area: "184 m²",
    cover: "/img/kariris-0.webp",
    text: "Um projeto pensado para transformar qualidade de vida em realidade, num lote de 11 x 30 m.",
    facts: ["Lote de 370 m²", "184 m² construídos"],
    gallery: ["/img/kariris-0.webp"],
  },
  {
    slug: "casa-gourmet",
    title: "Casa Gourmet",
    kind: "Projeto",
    tag: "Lazer e piscina",
    place: "Juazeiro do Norte, CE",
    cover: "/img/gourmet-0.webp",
    text: "Área gourmet com forro em madeira aberta para a piscina, fachada de volumes limpos e iluminação de destaque. Do render à obra que já começou.",
    gallery: g("gourmet", 4),
  },
];

export const comparisons = [
  { slug: "a", title: "Casa térrea", before: "/img/pxe-a-0.webp", after: "/img/pxe-a-1.webp" },
  { slug: "b", title: "Casa com garagem", before: "/img/pxe-b-1.webp", after: "/img/pxe-b-0.webp" },
];

export const services = [
  { title: "Projetos arquitetônicos", sub: "Residenciais e para venda", text: "Casas térreas, duplex e empreendimentos pensados para a rotina de quem vai morar e para o valor do imóvel. Cada escolha tem um propósito.", video: "bom-projeto" },
  { title: "Construção financiada", sub: "Do projeto às chaves", text: "Organizo projeto, orçamento e etapas para a obra financiada não virar dor de cabeça, com tudo dentro do que o banco exige.", video: "boa-vontade" },
  { title: "Perícias e laudos", sub: "Engenharia diagnóstica", text: "Laudos técnicos, vistorias de recebimento e análise de patologias: trincas, infiltrações e falhas que aparecem depois da obra.", video: "verga" },
  { title: "Fachadas", sub: "Identidade e valorização", text: "Fachadas que valorizam o imóvel no mercado e respeitam a técnica: volumetria, materiais e detalhes que protegem da água e do sol.", video: "colado-divisa" },
];

export const videos = [
  { slug: "janela-1", title: "Janela voltada pro vizinho", text: "Afastamento entre casas: o que a lei diz", views: "3,9 mi" },
  { slug: "agua-telhado", title: "Água do telhado do vizinho", text: "Pode cair no seu terreno?", views: "3,1 mi" },
  { slug: "janela-2", title: "Janelas, parte 2", text: "O prazo que a lei coloca", views: "2,4 mi" },
  { slug: "muro-divisa", title: "Muro de divisa", text: "Quem paga e quem constrói", views: "1,9 mi" },
  { slug: "colado-divisa", title: "Construir colado na divisa", text: "Pode ou não pode?", views: "1,7 mi" },
  { slug: "muro-vizinho", title: "Em cima do muro do vizinho", text: "Tem regra, sim", views: "632 mil" },
  { slug: "verga", title: "Verga e contra-verga", text: "Por que a parede trinca", views: "163 mil" },
  { slug: "boa-vontade", title: "Boa vontade na obra", text: "Sem técnica, vira problema", views: "4,2 mi" },
];

export const workVideos = [
  { slug: "residencia-rs", title: "Residência R|S", text: "Tour pelo duplex pronto" },
  { slug: "tour-casa", title: "Casa com pé-direito duplo", text: "Ilha em granito, gourmet e garagem para 2" },
  { slug: "casa-acude", title: "Casa no Açude Umari", text: "365 dias entre o esquadro e a casa tomando forma", credit: "Vídeo: @douglasleiteinteriores" },
];

export const testimonials = [
  { text: "Um sonho realizado.", name: "Ranniere Figueiredo", where: "Residência R|S", image: "/img/rs-1.webp" },
  { text: "Muito profissionalismo envolvido.", name: "Kleber Brito", where: "Residência R|S", image: "/img/rs-0.webp" },
  { text: "A melhor da região.", name: "Breno Nascimento", where: "Residência R|S", image: "/img/rs-3.webp" },
  { text: "Trabalho maravilhoso. Top de verdade.", name: "Simone Lôbo", where: "Residência R|S", image: "/img/rs-4.webp" },
  { text: "Minha! Em breve iremos tirar do papel.", name: "Simony Sampaio", where: "Projeto SS", image: "/img/ss-0.webp" },
  { text: "Excelente acabamento. Muito bonita a casa!", name: "Luciléa Gomes", where: "Casa com pé-direito duplo", image: "/img/emp151-0.webp" },
  { text: "Que casa linda, parabéns!", name: "Samuel Luna, construtor", where: "Casa B & N", image: "/img/bn-0.webp" },
];

export const faq = [
  { q: "Onde você atende?", a: "Em Juazeiro do Norte, Crato e região do Cariri. Projetos também podem ser feitos a distância." },
  { q: "Você faz só o projeto ou acompanha a obra?", a: "Os dois. Faço o projeto arquitetônico e os complementares, e acompanho a execução, inclusive em obra financiada." },
  { q: "Faz laudo e perícia?", a: "Sim: laudos técnicos, vistoria de recebimento de obra e engenharia diagnóstica para trincas, infiltrações e outras patologias." },
  { q: "Como peço um orçamento?", a: "Pelo WhatsApp ou pelo formulário aqui embaixo. Conte o que você precisa, o tamanho do terreno e a cidade." },
];
