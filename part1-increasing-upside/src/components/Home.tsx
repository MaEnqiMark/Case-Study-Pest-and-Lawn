import Link from "next/link";
import { CheckCircle, Shield, Users, Award, Bug, Leaf, Droplets, TreeDeciduous, Star, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Home() {
  const features = [
    {
      icon: Shield,
      title: "Licensed & Insured",
      description: "Fully certified professionals you can trust",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Trained specialists with years of experience",
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "100% satisfaction guaranteed on all services",
    },
  ];

  const services = [
    {
      icon: Bug,
      title: "Pest Control",
      description: "Effective elimination of insects, rodents, and pests with eco-friendly solutions.",
      image: "https://images.unsplash.com/photo-1758522965291-36664fbdac9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXN0JTIwY29udHJvbCUyMHRlY2huaWNpYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzczMjgwMTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Leaf,
      title: "Lawn Care",
      description: "Professional lawn maintenance, mowing, and fertilization to keep your yard pristine.",
      image: "https://images.unsplash.com/photo-1738193830098-2d92352a1856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGxhd24lMjBtb3dpbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc3MzI4MDE5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Droplets,
      title: "Mosquito Control",
      description: "Seasonal mosquito treatments to protect your family and enjoy your outdoor space.",
      image: "https://images.unsplash.com/photo-1735445190698-fb6fa43ae6c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3NxdWl0byUyMHNwcmF5JTIwb3V0ZG9vciUyMHRyZWF0bWVudHxlbnwxfHx8fDE3NzMyODAxODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: TreeDeciduous,
      title: "Tree & Shrub Care",
      description: "Expert care for your trees and shrubs including disease prevention and treatment.",
      image: "https://images.unsplash.com/photo-1756428785435-c3a6b74147d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJ0aWxpemVyJTIwbGF3biUyMGFwcGxpY2F0aW9ufGVufDF8fHx8MTc3MzI4MDE4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "GreenGuard transformed our lawn! It's never looked better. The team is professional and always on time.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      text: "Finally got rid of our pest problem. They're thorough, effective, and use safe products around our kids and pets.",
      rating: 5,
    },
    {
      name: "Emily Chen",
      text: "Best lawn service in town! They're responsive, affordable, and do excellent work. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Professional Pest Control & Lawn Care Services
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Protect your home and beautify your lawn with our expert services. Licensed, insured, and trusted by thousands of homeowners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/find-treatment"
                  className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
                >
                  Find the Right Treatment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a
                  href="tel:+15551234567"
                  className="inline-flex items-center justify-center bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors text-lg font-semibold"
                >
                  Call Now
                </a>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758555225908-9930716a8e19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBsYW5kc2NhcGVkJTIweWFyZCUyMGhvbWV8ZW58MXx8fHwxNzczMjgwMTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Beautiful landscaped yard"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for all your pest control and lawn care needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col"
                >
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                    <Link
                      href="/services"
                      className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center mt-auto"
                    >
                      Learn More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose PestxLawn?
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Eco-Friendly Solutions", desc: "We use environmentally responsible products that are safe for your family and pets." },
                  { title: "Experienced Professionals", desc: "Our team has over 20 years of combined experience in pest control and lawn care." },
                  { title: "Affordable Pricing", desc: "Competitive rates with flexible payment plans and seasonal packages available." },
                  { title: "Satisfaction Guaranteed", desc: "We stand behind our work with a 100% satisfaction guarantee on all services." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1730808465658-e8703d1dc5cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwaG9tZW93bmVyfGVufDF8fHx8MTc3MzI4MDE4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy customer"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don&apos;t just take our word for it
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{testimonial.text}&quot;</p>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Get your free quote today and see why thousands of homeowners trust PestxLawn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-treatment"
              className="inline-flex items-center justify-center bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
            >
              Get Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center justify-center bg-green-700 text-white px-8 py-4 rounded-lg hover:bg-green-800 transition-colors text-lg font-semibold"
            >
              Call (555) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
