import { useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/SEO";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

// Import all gallery images
import residentialImg from "@/assets/service-residential.jpg";
import appliancesImg from "@/assets/service-appliances.jpg";
import yardWasteImg from "@/assets/service-yard-waste.jpg";
import cleanupsImg from "@/assets/service-cleanouts.jpg";
import constructionImg from "@/assets/service-construction.jpg";
import commercialImg from "@/assets/service-commercial.jpg";
import lightDemolitionImg from "@/assets/service-light-demolition.jpg";
import hazmatImg from "@/assets/service-hazmat.jpg";
import heroImg from "@/assets/hero-junk.jpg";
import truckImg from "@/assets/old-reliable-truck.jpg";

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  { src: heroImg, alt: "Junky Gurus team at work", category: "Team" },
  { src: truckImg, alt: "Our reliable junk removal truck", category: "Equipment" },
  { src: residentialImg, alt: "Residential junk removal in action", category: "Residential" },
  { src: appliancesImg, alt: "Appliance removal service", category: "Appliances" },
  { src: yardWasteImg, alt: "Yard waste and debris cleanup", category: "Yard Waste" },
  { src: cleanupsImg, alt: "Garage and estate cleanout", category: "Cleanouts" },
  { src: constructionImg, alt: "Construction debris removal", category: "Construction" },
  { src: commercialImg, alt: "Commercial cleanout service", category: "Commercial" },
  { src: lightDemolitionImg, alt: "Light demolition project", category: "Demolition" },
  { src: hazmatImg, alt: "Hazardous materials handling", category: "Hazmat" },
];

const categories = ["All", ...new Set(galleryImages.map(img => img.category))];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <Layout>
      <SEO
        title="Photo Gallery | Junky Gurus - See Our Work"
        description="Browse photos of our junk removal projects across Skagit County. From residential cleanouts to commercial jobs, see the Junky Gurus team in action."
        url="/gallery"
      />
      
      <section className="py-16 md:py-24">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Work in Action
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real photos from real jobs. No stock images here — just the Junky Gurus team doing what we do best.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                    {image.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm">{selectedImage.alt}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/90 text-primary-foreground text-xs font-medium rounded">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
