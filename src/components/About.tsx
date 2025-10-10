import { useEffect, useRef, useState } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary mb-6">
              Our Story
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              For over 20 years, Shahi Baker has been crafting
              exceptional baked goods with passion and dedication. What started
              as a small family bakery has grown into a beloved community
              gathering place.
            </p>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              We believe in using only the finest ingredients, traditional
              baking methods, and a whole lot of love in everything we create.
              From our signature Cookies to our decadent chocolate cakes,
              every item is made fresh daily.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're celebrating a special occasion or simply treating
              yourself, we're here to make your day a little sweeter.
            </p>
          </div>

          <div
            className={`grid grid-cols-2 gap-6 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
            style={{ minHeight: '260px', alignItems: 'stretch' }}
          >
            <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-soft)] hover-lift text-center flex flex-col justify-center h-full">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-3xl font-bold text-primary">20+</div>
              <div className="text-sm text-muted-foreground">Years</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-soft)] hover-lift text-center flex flex-col justify-center h-full">
              <div className="text-4xl mb-2">😊</div>
              <div className="text-3xl font-bold text-primary">50k+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-soft)] hover-lift text-center flex flex-col justify-center h-full">
              
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Daily Items</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-soft)] hover-lift text-center flex flex-col justify-center h-full">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-3xl font-bold text-primary">5.0</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
