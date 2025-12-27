import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Truck, Recycle, Clock, Shield, CheckCircle, MapPin, Sparkles, Heart, XCircle, Award, Leaf, Star, Camera, ArrowRight, Home } from "lucide-react";
import heroImage from "@/assets/hero-junk.jpg";

const services = [
  { name: "Limpieza Residencial", desc: "Muebles, electrodomésticos, garaje, sótano" },
  { name: "Remoción de Electrodomésticos", desc: "Refrigeradores, lavadoras, secadoras, estufas" },
  { name: "Escombros de Jardín", desc: "Ramas, hojas, césped, tierra" },
  { name: "Limpieza de Propiedades", desc: "Desalojos, herencias, propiedades abandonadas" },
  { name: "Escombros de Construcción", desc: "Madera, paneles de yeso, pisos" },
  { name: "Limpieza Comercial", desc: "Oficinas, tiendas, almacenes" },
  { name: "Materiales Peligrosos", desc: "Pintura, químicos, baterías (con cita previa)" },
];

const serviceAreas = [
  { county: "Condado de Skagit", cities: ["Mount Vernon", "Burlington", "Anacortes", "Sedro-Woolley", "La Conner"] },
  { county: "Condado de Whatcom", cities: ["Bellingham", "Lynden", "Ferndale", "Blaine"] },
  { county: "Condado de Snohomish", cities: ["Everett", "Marysville", "Arlington", "Lake Stevens"] },
  { county: "Condado de King", cities: ["North Seattle", "Shoreline", "Kenmore", "Bothell"] },
];

const noSorpresas = [
  "Cargos ocultos o sorpresas de 'eso cuesta extra'",
  "Citas incumplidas o ventanas de llegada vagas",
  "Basura tirada ilegalmente",
  "Ventas agresivas cuando llegamos",
  "Burocracia corporativa cuando algo sale mal",
];

const senalesConfianza = [
  {
    icon: Clock,
    title: "Horarios Confiables",
    description: "Cuando decimos martes a las 10, es martes a las 10. Sin ventanas de llegada vagas.",
  },
  {
    icon: Shield,
    title: "Licenciados y Asegurados",
    description: "Completamente cubiertos para que no tenga que preocuparse.",
  },
  {
    icon: Home,
    title: "Donamos a Habitat for Humanity",
    description: "Los artículos usables van a ReStore. Reciclamos metales. El vertedero es el último recurso.",
  },
  {
    icon: Heart,
    title: "Descuento para Veteranos y Mayores",
    description: "15% de descuento para quienes han servido. Sin papeleo—solo avísenos.",
  },
  {
    icon: Award,
    title: "Empresa Local",
    description: "Vivimos aquí. Contestamos nuestros teléfonos. Su vecindario nos importa.",
  },
  {
    icon: Recycle,
    title: "Disposición Responsable",
    description: "Clasificamos cada carga. Los artículos usables tienen una segunda vida.",
  },
];

const estadisticas = [
  { value: "500+", label: "Trabajos Completados" },
  { value: "4.9", label: "Calificación" },
  { value: "Mismo Día", label: "Servicio Disponible" },
  { value: "100%", label: "Satisfacción" },
];

const Espanol = () => {
  return (
    <Layout>
      <SEO
        title="Servicio de Remoción de Basura - Mount Vernon WA | ¡Hablamos Español!"
        description="Servicio profesional de remoción de basura en Mount Vernon y el área de Puget Sound. Precios transparentes, servicio el mismo día. ¡Hablamos español! Llame (360) 610-9233."
        keywords="remoción de basura, servicio de basura, limpieza de casa, Mount Vernon, Skagit County, hablamos español, junk removal spanish"
        url="/espanol"
        pageType="landing"
        pagePurpose="Spanish language version of the site. Servicios de remoción de basura. Contact: (360) 610-9233. ¡Hablamos Español!"
      />

      {/* Language Toggle Banner */}
      <div className="bg-muted border-b border-border">
        <div className="container py-2 flex items-center justify-center gap-2 text-sm">
          <span className="text-muted-foreground">This page is in Spanish.</span>
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
          >
            <span aria-hidden="true">🇺🇸</span>
            View in English
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/60" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/30">
              <Clock className="h-4 w-4" />
              Servicio el Mismo Día Disponible
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-primary mb-6 leading-tight">
              Nos Encanta Tu Basura{" "}
              <span className="text-primary">(Para Que Tú No Tengas Que Hacerlo)</span>
            </h1>

            <p className="text-xl text-on-primary-muted mb-8 leading-relaxed">
              Precios reales por adelantado. Horarios confiables. Disposición responsable. De un equipo local que realmente llega.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/book">
                  Reservar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="invert" className="text-lg px-8 py-6" asChild>
                <Link to="/ai-estimator">
                  <Camera className="mr-2 h-5 w-5" />
                  Sepa Su Precio Primero
                </Link>
              </Button>
              <Button size="lg" variant="hero" className="text-lg px-8 py-6" asChild>
                <a href="tel:+13606109233">
                  <Phone className="mr-2 h-5 w-5" />
                  (360) 610-9233
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-on-primary-muted text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇲🇽</span>
                ¡Hablamos Español!
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Asegurados y Licenciados
              </div>
              <div className="flex items-center gap-2">
                <Recycle className="h-4 w-4 text-primary" />
                Reciclaje Responsable
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                15% Descuento Veteranos/Mayores
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-lg text-muted-foreground">
              Proceso simple en 3 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">1</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Llámenos</h3>
              <p className="text-muted-foreground">
                Llame, envíe un texto, o use nuestro estimador con fotos para saber su precio.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">2</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Reciba Su Precio</h3>
              <p className="text-muted-foreground">
                Le damos un precio justo y transparente. Sin cargos ocultos. Nunca.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">¡Listo!</h3>
              <p className="text-muted-foreground">
                Llegamos, cargamos y limpiamos todo. Usted se relaja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Removemos Básicamente Cualquier Cosa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sofás, refrigeradores, esa cosa rara en tu sótano que tienes miedo de tocar — lo hemos visto todo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/services">
                Ver Todos los Servicios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Estimator CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <Camera className="h-4 w-4" />
              Tecnología IA
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sepa Su Precio Antes de Que Lleguemos
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Suba fotos de su basura y obtenga un estimado instantáneo. Sin llamadas telefónicas, sin esperar, sin sorpresas.
            </p>
            <Button asChild size="lg">
              <Link to="/ai-estimator">
                <Camera className="mr-2 h-5 w-5" />
                Probar el Estimador con Fotos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* No Surprises Section */}
      <section className="py-12 md:py-16 bg-destructive/5 border-y border-destructive/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Lo Que NO Recibirá de Nosotros
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {noSorpresas.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-destructive/20 text-sm text-muted-foreground"
                >
                  <XCircle className="h-4 w-4 text-destructive/60 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 pb-12 border-b border-border">
            {estadisticas.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust signals grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {senalesConfianza.map((signal) => (
              <div
                key={signal.title}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <signal.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{signal.title}</h3>
                  <p className="text-sm text-muted-foreground">{signal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Áreas de Servicio
            </h2>
            <p className="text-lg text-muted-foreground">
              Servimos aproximadamente 50 millas desde Mount Vernon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceAreas.map((area) => (
              <div key={area.county} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{area.county}</h3>
                </div>
                <ul className="space-y-1">
                  {area.cities.map((city) => (
                    <li key={city} className="text-sm text-muted-foreground">
                      {city}, WA
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo Para Reclamar Su Espacio?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Su basura es nuestra pasión. Hagamos que desaparezca. ¡Hablamos español!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a href="tel:+13606109233">
                <Phone className="mr-2 h-5 w-5" />
                (360) 610-9233
              </a>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a href="sms:+13606109233">
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar Texto
              </a>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" asChild>
              <Link to="/book">
                Reservar en Línea
              </Link>
            </Button>
            <Button size="lg" variant="hero" asChild>
              <Link to="/ai-estimator">
                <Camera className="mr-2 h-5 w-5" />
                Estimador con Fotos
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm opacity-75">
            Nota: Algunos formularios están en inglés. ¡Llámenos para servicio completo en español!
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Espanol;
