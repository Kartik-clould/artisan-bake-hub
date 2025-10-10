import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import chocolateCake from "@/assets/products/chocolate-cake.jpg";
import croissants from "@/assets/products/croissants.jpg";
import sourdough from "@/assets/products/sourdough.jpg";
import cookies from "@/assets/products/cookies.jpg";
import cheesecake from "@/assets/products/cheesecake.jpg";
import macarons from "@/assets/products/macarons.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Chocolate Cake",
    price: 35.99,
    description: "Rich chocolate layers with ganache",
    image: chocolateCake,
    category: "Cakes",
  },
  {
    id: 2,
    name: "Fresh Croissants",
    price: 4.99,
    description: "Buttery, flaky perfection",
    image: croissants,
    category: "Pastries",
  },
  {
    id: 3,
    name: "Sourdough Bread",
    price: 7.99,
    description: "Artisan sourdough with crispy crust",
    image: sourdough,
    category: "Breads",
  },
  {
    id: 4,
    name: "Chocolate Chip Cookies",
    price: 12.99,
    description: "Classic cookies, dozen",
    image: cookies,
    category: "Cookies",
  },
  {
    id: 5,
    name: "Strawberry Cheesecake",
    price: 32.99,
    description: "Creamy cheesecake with fresh strawberries",
    image: cheesecake,
    category: "Cakes",
  },
  {
    id: 6,
    name: "French Macarons",
    price: 18.99,
    description: "Assorted flavors, box of 12",
    image: macarons,
    category: "Pastries",
  },
];

const categories = ["All", "Cakes", "Pastries", "Breads", "Cookies"];

interface MenuProps {
  onAddToCart: (product: Product) => void;
}

const Menu = ({ onAddToCart }: MenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="py-20 px-4 bg-background"
    >
      <div className="container mx-auto max-w-7xl">
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary mb-4">
            Our Menu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our delicious selection of freshly baked goods
          </p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] hover-lift group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100 + 400}ms` }}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                  {product.category}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold font-serif text-card-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
