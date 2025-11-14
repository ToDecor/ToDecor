import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProductsPreview } from "@/components/products-preview"
import { PopularProducts } from "@/components/popular-products"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TestimonialForm } from "@/components/testimonial-form"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <ProductsPreview />
      <PopularProducts />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Votre avis nous intéresse
            </h2>
            <p className="text-lg text-muted-foreground">
              Partagez votre expérience avec ToDecor et aidez d'autres clients à découvrir nos services.
            </p>
          </div>
          <TestimonialForm />
        </div>
      </section>
      <ContactForm />
      <Footer />
    </>
  )
}
