import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Truck, Recycle, Clock, Shield, CheckCircle, MapPin, Sparkles, Heart } from "lucide-react";
import heroImage from "@/assets/hero-junk.jpg";

const services = [
  { name: "Limpieza Residencial", desc: "Muebles, electrodomésticos, garaje, sótano" },
  { name: "Limpieza Comercial", desc: "Oficinas, tiendas, almacenes" },
  { name: "Electrodomésticos", desc: "Refrigeradores, lavadoras, secadoras" },
  { name: "Escombros de Jardín", desc: "Ramas, hojas, césped, tierra" },
  { name: "Escombros de Construcción", desc: "Madera, paneles de yeso, pisos" },
  { name: "Demolición Ligera", desc: "Cobertizos, cercas, terrazas pequeñas" },
  { name: "Limpieza de Propiedades", desc: "Desalojos, herencias, propiedades abandonadas" },
  { name: "Materiales Peligrosos", desc: "Pintura, químicos, baterías (con cita previa)" },
];

const serviceAreas = [
  { county: "Condado de Skagit", cities: ["Mount Vernon", "Burlington", "Anacortes", "Sedro-Woolley", "La Conner"] },
  { county: "Condado de Whatcom", cities: ["Bellingham", "Lynden", "Ferndale", "Blaine"] },
  { county: "Condado de Snohomish", cities: ["Everett", "Marysville", "Arlington", "Lake Stevens"] },
  { county: "Condado de King", cities: ["North Seattle", "Shoreline", "Kenmore", "Bothell"] },
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
              <span className="text-lg">🇲🇽</span>
              ¡Hablamos Español!
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-primary mb-6 leading-tight">
              Servicio de Remoción de Basura en{" "}
              <span className="text-primary">Mount Vernon</span>
            </h1>

            <p className="text-xl text-on-primary-muted mb-8 leading-relaxed">
              Limpiamos su hogar o negocio — ¡Rápido, confiable y a buen precio!
              Servicio profesional con precios transparentes. Sin sorpresas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href="tel:+13606109233">
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar Ahora
                </a>
              </Button>
              <Button size="lg" variant="hero" className="text-lg px-8 py-6" asChild>
                <a href="sms:+13606109233">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Enviar Texto
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-on-primary-muted text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Servicio el Mismo Día
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
                15% Descuento para Veteranos y Personas Mayores
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Removemos casi cualquier cosa. Desde un solo artículo hasta limpieza completa de propiedades.
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
                    <h3 className="font-semibold text-charcoal mb-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
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
              <h3 className="text-xl font-semibold text-charcoal mb-2">Llámenos</h3>
              <p className="text-muted-foreground">
                Llame o envíe un texto. Cuéntenos qué necesita remover.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">2</div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">Reciba Su Precio</h3>
              <p className="text-muted-foreground">
                Le damos un precio justo y transparente. Sin cargos ocultos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">¡Listo!</h3>
              <p className="text-muted-foreground">
                Llegamos, cargamos y limpiamos todo. Usted se relaja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Áreas de Servicio
            </h2>
            <p className="text-lg text-muted-foreground">
              Servimos a todo el noroeste de Washington
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceAreas.map((area) => (
              <div key={area.county} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-charcoal">{area.county}</h3>
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
            ¿Listo Para Limpiar?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Llámenos hoy para una cotización gratis. ¡Hablamos español!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a href="tel:+13606109233">
                <Phone className="mr-2 h-5 w-5" />
                (360) 610-9233
              </a>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a href="tel:+13604222428">
                <Phone className="mr-2 h-5 w-5" />
                (360) 422-2428
              </a>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" asChild>
              <a href="sms:+13606109233">
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar Texto
              </a>
            </Button>
            <Button size="lg" variant="hero" asChild>
              <Link to="/book">
                Reservar en Línea
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm opacity-75">
            Nota: Los formularios en línea están en inglés. ¡Llámenos para servicio completo en español!
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Espanol;
