import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bakery.jpg";

interface HeroProps {
  onOrderNow: () => void;
}

const Hero = ({ onOrderNow }: HeroProps) => {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-float">
          <div className="text-6xl mb-6 font-extrabold text-accent drop-shadow-sm" style={{fontFamily: 'Abril Fatface, serif', letterSpacing: '0.05em'}}>SHAHI</div>
        </div>
        <h2 className="text-5xl md:text-7xl font-bold font-serif text-primary-foreground mb-6 fade-in-up">
          Freshly Baked
          <span className="block text-accent mt-2">Every Morning</span>
        </h2>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 fade-in-up max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
          Artisan breads, pastries, and cakes made with love and the finest
          ingredients
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button
            onClick={onOrderNow}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-lg hover-lift"
          >
            Order Now
          </Button>
          <Button
            onClick={() => {
              const element = document.getElementById("menu");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            size="lg"
            variant="outline"
            className="bg-background/20 backdrop-blur-sm border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6 rounded-full"
          >
            View Menu
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="text-primary-foreground text-4xl">↓</div>
      </div>
    </section>
  );
};

export default Hero;
