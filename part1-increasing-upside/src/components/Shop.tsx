"use client";
import { useState } from "react";
import { ShoppingCart, Shield, Bug, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  displayPrice: string;
  image: string;
}

export function Shop() {
  const { addItem, itemCount } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: "sentricon-1", name: "Sentricon Termite Protection System",
      description: "The #1 choice for termite protection. This professional-grade bait system eliminates termite colonies and provides continuous monitoring.",
      price: 299.99, displayPrice: "$299.99",
      image: "https://images.unsplash.com/photo-1758522965153-37253377a397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXJtaXRlJTIwcHJvdGVjdGlvbiUyMHN5c3RlbSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyODcxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "outdoor-spray", name: "Outdoor Pest Defense Spray",
      description: "Create a protective barrier around your home with our weather-resistant formula. Up to 90 days of outdoor pest protection.",
      price: 42.99, displayPrice: "$42.99",
      image: "https://images.unsplash.com/photo-1653543362966-a97e081f3086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwcGVzdCUyMHNwcmF5JTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "indoor-pesticide", name: "Professional Indoor Pesticide",
      description: "Fast-acting indoor pest control effective against ants, roaches, spiders, and other household pests. Safe when used as directed.",
      price: 34.99, displayPrice: "$34.99",
      image: "https://images.unsplash.com/photo-1747659629851-a92bd71149f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBwZXN0aWNpZGUlMjBzcHJheSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "fertilizer", name: "Premium Lawn Fertilizer",
      description: "Professional-grade fertilizer blend for thick, healthy grass growth and deep root development. Covers up to 5,000 sq ft.",
      price: 49.99, displayPrice: "$49.99",
      image: "https://images.unsplash.com/photo-1757840981839-6d71bb4ba3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXduJTIwZmVydGlsaXplciUyMGJhZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyODcxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Professional Products</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">Premium pest control and lawn care products trusted by professionals</p>
          {itemCount > 0 && (
            <Link href="/cart" className="inline-flex items-center gap-2 mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              <ShoppingCart className="w-5 h-5" /> View Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
            </Link>
          )}
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all shadow-md group flex flex-col">
                <div className="relative h-72 bg-gray-50 overflow-hidden">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-1">{product.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-green-600">{product.displayPrice}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-4 rounded-lg transition-colors font-semibold flex items-center justify-center text-lg ${
                      addedId === product.id
                        ? "bg-green-700 text-white"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {addedId === product.id ? (
                      <><Check className="w-5 h-5 mr-2" /> Added to Cart!</>
                    ) : (
                      <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: Shield, title: "Professional Grade", desc: "Same quality products used by our certified technicians" },
              { icon: Bug, title: "Expert Support", desc: "Our team is here to help you choose the right products" },
              { icon: ShoppingCart, title: "Fast Shipping", desc: "Free shipping on orders over $75 in the Norman, OK area" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i}>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <Icon className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-lg">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Need Professional Application?</h2>
          <p className="text-xl text-green-50 mb-8">Let our experts handle it for you with our professional service plans</p>
          <a href="/plans" className="inline-block bg-white text-green-600 px-10 py-5 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-xl">
            View Service Plans
          </a>
        </div>
      </section>
    </div>
  );
}
