"use client";
import { useState, useEffect, Suspense } from "react";
import { Phone, Mail, MapPin, Clock, Send, ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RecommendedProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

const productsByService: Record<string, RecommendedProduct[]> = {
  "pest-control": [
    { id: "outdoor-spray", name: "Outdoor Pest Defense Spray", description: "Weather-resistant barrier formula. Up to 90 days of outdoor pest protection.", price: "$42.99", image: "https://images.unsplash.com/photo-1653543362966-a97e081f3086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwcGVzdCUyMHNwcmF5JTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "indoor-pesticide", name: "Professional Indoor Pesticide", description: "Fast-acting against ants, roaches, spiders. Safe when used as directed.", price: "$34.99", image: "https://images.unsplash.com/photo-1747659629851-a92bd71149f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBwZXN0aWNpZGUlMjBzcHJheSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "sentricon-1", name: "Sentricon Termite Protection System", description: "Professional-grade bait system that eliminates termite colonies.", price: "$299.99", image: "https://images.unsplash.com/photo-1758522965153-37253377a397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXJtaXRlJTIwcHJvdGVjdGlvbiUyMHN5c3RlbSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyODcxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ],
  "lawn-care": [
    { id: "fertilizer", name: "Premium Lawn Fertilizer", description: "Professional-grade blend for thick, healthy grass. Covers up to 5,000 sq ft.", price: "$49.99", image: "https://images.unsplash.com/photo-1757840981839-6d71bb4ba3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXduJTIwZmVydGlsaXplciUyMGJhZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ],
  "mosquito-control": [
    { id: "outdoor-spray", name: "Outdoor Pest Defense Spray", description: "Weather-resistant barrier formula. Up to 90 days of outdoor pest protection.", price: "$42.99", image: "https://images.unsplash.com/photo-1653543362966-a97e081f3086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwcGVzdCUyMHNwcmF5JTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ],
  "tree-shrub": [
    { id: "fertilizer", name: "Premium Lawn Fertilizer", description: "Professional-grade blend for thick, healthy grass. Covers up to 5,000 sq ft.", price: "$49.99", image: "https://images.unsplash.com/photo-1757840981839-6d71bb4ba3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXduJTIwZmVydGlsaXplciUyMGJhZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ],
  "residential": [
    { id: "outdoor-spray", name: "Outdoor Pest Defense Spray", description: "Weather-resistant barrier formula. Up to 90 days of outdoor pest protection.", price: "$42.99", image: "https://images.unsplash.com/photo-1653543362966-a97e081f3086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwcGVzdCUyMHNwcmF5JTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "fertilizer", name: "Premium Lawn Fertilizer", description: "Professional-grade blend for thick, healthy grass. Covers up to 5,000 sq ft.", price: "$49.99", image: "https://images.unsplash.com/photo-1757840981839-6d71bb4ba3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXduJTIwZmVydGlsaXplciUyMGJhZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ],
  "commercial": [
    { id: "outdoor-spray", name: "Outdoor Pest Defense Spray", description: "Weather-resistant barrier formula. Up to 90 days of outdoor pest protection.", price: "$42.99", image: "https://images.unsplash.com/photo-1653543362966-a97e081f3086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwcGVzdCUyMHNwcmF5JTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "indoor-pesticide", name: "Professional Indoor Pesticide", description: "Fast-acting against ants, roaches, spiders. Safe when used as directed.", price: "$34.99", image: "https://images.unsplash.com/photo-1747659629851-a92bd71149f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBwZXN0aWNpZGUlMjBzcHJheSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fHwxNzczMjg3MTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  ],
};

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", service: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedService, setSubmittedService] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const name = searchParams.get("name") || "";
    const email = searchParams.get("email") || "";
    const phone = searchParams.get("phone") || "";
    const serviceParam = searchParams.get("service") || "";

    const serviceMapping: { [key: string]: string } = {
      "quarterly-pest": "pest-control",
      "mosquito-treatment": "mosquito-control",
      "termite-inspection": "pest-control",
      "lawn-fertilization": "lawn-care",
      "soil-testing": "lawn-care",
    };

    const service = serviceMapping[serviceParam] || serviceParam || "";
    setFormData({ name, email, phone, service, message: "" });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const serviceLabels: Record<string, string> = {
      "pest-control": "Pest Control",
      "lawn-care": "Lawn Care & Fertilization",
      "mosquito-control": "Mosquito & Tick Control",
      "tree-shrub": "Tree & Shrub Care",
      "residential": "Residential Package",
      "commercial": "Commercial Services",
    };

    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "markma18@seas.upenn.edu",
          subject: `New Quote Request: ${serviceLabels[formData.service] || formData.service}`,
          body: [
            `New contact form submission from PestxLawn website:`,
            ``,
            `Name: ${formData.name}`,
            `Email: ${formData.email}`,
            `Phone: ${formData.phone}`,
            `Service: ${serviceLabels[formData.service] || formData.service}`,
            `Message: ${formData.message || "(none)"}`,
          ].join("\n"),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setSubmittedService(formData.service);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleNewRequest = () => {
    setSubmitted(false);
    setSubmittedService("");
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
  };

  const recommendedProducts = productsByService[submittedService] || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Request a Free Quote</h2>
      {submitted ? (
        <div>
          <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">Thank You!</h3>
            <p className="text-green-800">We&apos;ve received your message and will get back to you within 24 hours.</p>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Recommended Products For You</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">While you wait, check out these products that complement your selected service:</p>
              <div className="space-y-4">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="flex gap-4 items-center bg-gray-50 rounded-lg p-3">
                    <ImageWithFallback src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{product.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-green-600">{product.price}</p>
                      <Link href="/shop" className="text-xs text-green-600 hover:text-green-700 font-semibold">
                        View in Shop
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleNewRequest} className="w-full mt-4 bg-white text-green-600 border-2 border-green-600 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold">
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { id: "name", label: "Full Name *", type: "text", placeholder: "John Smith" },
            { id: "email", label: "Email Address *", type: "email", placeholder: "john@example.com" },
            { id: "phone", label: "Phone Number *", type: "tel", placeholder: "(555) 123-4567" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-semibold text-gray-900 mb-2">{field.label}</label>
              <input type={field.type} id={field.id} name={field.id} required value={(formData as unknown as Record<string, string>)[field.id] || ""}
                onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={field.placeholder} />
            </div>
          ))}
          <div>
            <label htmlFor="service" className="block text-sm font-semibold text-gray-900 mb-2">Service Interested In *</label>
            <select id="service" name="service" required value={formData.service} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select a service</option>
              <option value="pest-control">Pest Control</option>
              <option value="lawn-care">Lawn Care & Fertilization</option>
              <option value="mosquito-control">Mosquito & Tick Control</option>
              <option value="tree-shrub">Tree & Shrub Care</option>
              <option value="residential">Residential Package</option>
              <option value="commercial">Commercial Services</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
            <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Tell us about your needs..." />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <button type="submit" disabled={sending} className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-5 h-5 mr-2" /> {sending ? "Sending..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
}

export function Contact() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">Get in touch with us for a free quote or to schedule a service appointment</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-gray-700 mb-8">Have questions about our services? Our friendly team is here to help. Contact us by phone, email, or fill out the form.</p>
              <div className="space-y-6">
                {[
                  { icon: Phone, title: "Phone", content: <><a href="tel:+15551234567" className="text-green-600 hover:text-green-700">(555) 123-4567</a><p className="text-sm text-gray-600">Monday - Friday, 8am - 6pm</p></> },
                  { icon: Mail, title: "Email", content: <><a href="mailto:info@pestxlawn.com" className="text-green-600 hover:text-green-700">info@pestxlawn.com</a><p className="text-sm text-gray-600">We&apos;ll respond within 24 hours</p></> },
                  { icon: MapPin, title: "Address", content: <p className="text-gray-700">Norman, OK 73069</p> },
                  { icon: Clock, title: "Business Hours", content: <><p className="text-gray-700">Monday - Friday: 8:00am - 6:00pm</p><p className="text-gray-700">Saturday: 9:00am - 4:00pm</p><p className="text-gray-700">Sunday: Closed</p><p className="text-sm text-gray-600 mt-1">Emergency services available 24/7</p></> },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                          <Icon className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        {item.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Suspense fallback={<div className="bg-gray-50 rounded-2xl p-8 animate-pulse h-96" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visit Our Office</h2>
          <div className="rounded-2xl overflow-hidden h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104887.15596493822!2d-97.49647!3d35.2226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b269b3b5e8dbcb%3A0x3a3e3a1b3b3f3e3!2sNorman%2C+OK!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PestxLawn Office Location - Norman, OK"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-treatment" className="inline-flex items-center justify-center bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold">
              Get Free Quote <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="tel:+15551234567" className="inline-flex items-center justify-center bg-green-700 text-white px-8 py-4 rounded-lg hover:bg-green-800 transition-colors text-lg font-semibold">
              Call (555) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
