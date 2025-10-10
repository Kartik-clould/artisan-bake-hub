import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary mb-4">
            Visit Us
          </h2>
          <p className="text-lg text-muted-foreground">
            Come say hello and taste the difference
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-soft)] hover-lift text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Address</h3>
            <p className="text-sm text-muted-foreground">
              123 Bakery Lane<br />
              Sweet Town, ST 12345
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-soft)] hover-lift text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Phone</h3>
            <p className="text-sm text-muted-foreground">
              (555) 123-4567
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-soft)] hover-lift text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground">
              hello@sweethaven.com
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-soft)] hover-lift text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Hours</h3>
            <p className="text-sm text-muted-foreground">
              Mon-Sat: 7am - 7pm<br />
              Sun: 8am - 5pm
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
