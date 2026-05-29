import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";
import { JunkAnalyzer, DemolitionAnalyzer } from "@/components/features";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import { Phone, Camera, Lightbulb, Ruler, Eye, Trash2, Hammer, XCircle, CheckCircle } from "lucide-react";

const translations = {
  en: {
    seoTitle: "AI Photo Estimator - Skip the Sales Dance",
    seoDescription: "Know your junk removal price before we arrive. Upload a photo, get a real price. No phone tag, no on-site upsells, no surprises.",
    badge: "Skip the Sales Dance",
    heroTitle: "Know Your Price Before We Arrive",
    heroSubtitle: "Upload photos. Get a real price. No phone tag. No on-site upsells. No surprises.",
    noMore: "No More:",
    noMoreList: [
      "Phone tag with sales reps",
      "Waiting days for a callback",
      "On-site upsells or surprises",
    ],
    youGet: "You Get:",
    youGetList: [
      "Real price in seconds",
      "No obligation, no pressure",
      "What we quote is what you pay",
      "10% off for seniors & veterans",
    ],
    junkRemoval: "Junk Removal",
    lightDemolition: "Light Demolition",
    tipsTitle: "Tips for the Best Estimate",
    junkTips: [
      { title: "Good Lighting", description: "Natural light works best. Avoid harsh shadows." },
      { title: "Show Scale", description: "Include something for size reference if possible." },
      { title: "Capture Everything", description: "Make sure all items are visible in the frame." },
    ],
    demolitionTips: [
      { title: "Full Structure", description: "Capture the entire structure from multiple angles." },
      { title: "Show Condition", description: "Include close-ups of any damage or rot." },
      { title: "Access Points", description: "Show how we'll access the demolition area." },
    ],
    ctaTitle: "Prefer to Talk to a Human?",
    ctaSubtitle: "No problem! Give us a call or fill out our contact form.",
    ctaNote: "Same deal — we'll give you a real price with no surprises.",
    contactUs: "Contact Us",
  },
  es: {
    seoTitle: "Estimador con Foto IA - Sin Juegos de Ventas",
    seoDescription: "Conoce el precio de tu recolección de basura antes de que lleguemos. Sube una foto, obtén un precio real. Sin llamadas, sin ventas en sitio, sin sorpresas.",
    badge: "Sin Juegos de Ventas",
    heroTitle: "Conoce Tu Precio Antes de Que Lleguemos",
    heroSubtitle: "Sube fotos. Obtén un precio real. Sin llamadas telefónicas. Sin ventas en sitio. Sin sorpresas.",
    noMore: "Se Acabó:",
    noMoreList: [
      "Llamadas con vendedores",
      "Esperar días por respuesta",
      "Ventas adicionales o sorpresas",
    ],
    youGet: "Obtienes:",
    youGetList: [
      "Precio real en segundos",
      "Sin obligación, sin presión",
      "Lo que cotizamos es lo que pagas",
      "10% de descuento para mayores y veteranos",
    ],
    junkRemoval: "Recolección de Basura",
    lightDemolition: "Demolición Ligera",
    tipsTitle: "Consejos para el Mejor Estimado",
    junkTips: [
      { title: "Buena Iluminación", description: "La luz natural funciona mejor. Evita sombras fuertes." },
      { title: "Muestra la Escala", description: "Incluye algo para referencia de tamaño si es posible." },
      { title: "Captura Todo", description: "Asegúrate de que todos los artículos sean visibles." },
    ],
    demolitionTips: [
      { title: "Estructura Completa", description: "Captura la estructura completa desde varios ángulos." },
      { title: "Muestra la Condición", description: "Incluye fotos de cerca de cualquier daño." },
      { title: "Puntos de Acceso", description: "Muestra cómo accederemos al área de demolición." },
    ],
    ctaTitle: "¿Prefieres Hablar con una Persona?",
    ctaSubtitle: "¡Sin problema! Llámanos o llena nuestro formulario de contacto.",
    ctaNote: "Mismo trato — te daremos un precio real sin sorpresas.",
    contactUs: "Contáctanos",
  },
};

const AIEstimator = () => {
  const location = useLocation();
  const isSpanish = location.pathname === "/espanol" || location.pathname.startsWith("/espanol/");
  const t = isSpanish ? translations.es : translations.en;

  const tipIcons = [Lightbulb, Ruler, Eye];

  return (
    <Layout>
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        keywords="AI junk estimate, instant junk removal quote, demolition estimate, photo estimate, no hidden fees"
        url="/ai-estimator"
        pageType="tool"
        pagePurpose="AI-powered photo estimator tool. Skip the sales dance - upload photos to get instant, accurate price estimates with no obligation."
      />
      {/* Hero */}
      <section className="py-8 sm:py-12 md:py-20 bg-section-alt">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 sm:mb-6">
              <Camera className="h-4 w-4" />
              {t.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              {t.heroSubtitle}
            </p>
            
            {/* Anxiety Neutralizers */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-2xl mx-auto">
              <div className="flex-1 p-4 sm:p-5 rounded-xl bg-destructive/5 border border-destructive/10">
                <p className="text-sm font-medium text-destructive/80 mb-3">{t.noMore}</p>
                <ul className="space-y-2.5 sm:space-y-2">
                  {t.noMoreList.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 sm:gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-destructive/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm font-medium text-primary mb-3">{t.youGet}</p>
                <ul className="space-y-2.5 sm:space-y-2">
                  {t.youGetList.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 sm:gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analyzer Section with Tabs */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="container px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="junk" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 h-12 sm:h-10">
                <TabsTrigger value="junk" className="flex items-center gap-2 text-sm sm:text-sm py-3 sm:py-1.5 min-h-[48px] sm:min-h-0">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden xs:inline">{t.junkRemoval}</span>
                  <span className="xs:hidden">Junk</span>
                </TabsTrigger>
                <TabsTrigger value="demolition" className="flex items-center gap-2 text-sm sm:text-sm py-3 sm:py-1.5 min-h-[48px] sm:min-h-0">
                  <Hammer className="h-4 w-4" />
                  <span className="hidden xs:inline">{t.lightDemolition}</span>
                  <span className="xs:hidden">Demolition</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="junk">
                <JunkAnalyzer isSpanish={isSpanish} />
              </TabsContent>
              <TabsContent value="demolition">
                <DemolitionAnalyzer isSpanish={isSpanish} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-10 sm:py-16 md:py-24 bg-section-alt">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-charcoal text-center mb-6 sm:mb-8">
              {t.tipsTitle}
            </h2>
            
            <Tabs defaultValue="junk-tips" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 h-12 sm:h-10">
                <TabsTrigger value="junk-tips" className="py-3 sm:py-1.5 min-h-[48px] sm:min-h-0">{t.junkRemoval}</TabsTrigger>
                <TabsTrigger value="demolition-tips" className="py-3 sm:py-1.5 min-h-[48px] sm:min-h-0">{t.lightDemolition}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="junk-tips">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {t.junkTips.map((tip, index) => {
                    const Icon = tipIcons[index];
                    return (
                      <div
                        key={tip.title}
                        className="p-5 sm:p-6 rounded-xl bg-card border border-border text-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-charcoal mb-2">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="demolition-tips">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {t.demolitionTips.map((tip, index) => {
                    const Icon = tipIcons[index];
                    return (
                      <div
                        key={tip.title}
                        className="p-5 sm:p-6 rounded-xl bg-card border border-border text-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-charcoal mb-2">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="container px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-muted-foreground mb-2">
              {t.ctaSubtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-6 sm:mb-8">
              {t.ctaNote}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
              <Button asChild size="lg" className="min-h-[48px]">
                <Link to={isSpanish ? "/espanol#contacto" : "/contact"}>{t.contactUs}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-[48px]">
                <a href="tel:+13606109233">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 610-9233
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-[48px]">
                <a href="tel:+13604222428">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 422-2428
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AIEstimator;
