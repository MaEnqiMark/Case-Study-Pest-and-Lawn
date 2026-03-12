import Link from "next/link";
import { Shield, Award, Users, Heart, CheckCircle, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  const values = [
    { icon: Shield, title: "Integrity", description: "We believe in honest, transparent service and always do what's right for our customers." },
    { icon: Award, title: "Excellence", description: "We're committed to delivering the highest quality pest control and lawn care services." },
    { icon: Users, title: "Customer Focus", description: "Your satisfaction is our top priority. We listen, respond, and deliver results." },
    { icon: Heart, title: "Community", description: "We're proud to serve our local community and give back whenever we can." },
  ];

  const stats = [
    { number: "20+", label: "Years Experience" },
    { number: "5,000+", label: "Happy Customers" },
    { number: "15", label: "Service Professionals" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About PestxLawn</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">Your trusted partner for professional pest control and lawn care services since 1959.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>PestxLawn was founded in 1959 in Norman, Oklahoma with a simple mission: to provide homeowners and businesses with reliable, effective pest control and lawn care services they can trust.</p>
                <p>What started as a small, family-owned business has grown into one of the region&apos;s most trusted pest and lawn care companies. Despite our growth, we&apos;ve never lost sight of what made us successful&mdash;exceptional service, honest pricing, and a genuine commitment to our customers.</p>
                <p>Today, we&apos;re proud to serve thousands of residential and commercial customers throughout Norman and the surrounding Oklahoma communities. Our team of licensed, trained professionals brings decades of combined experience to every job.</p>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758522965291-36664fbdac9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXN0JTIwY29udHJvbCUyMHRlY2huaWNpYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzczMjgwMTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="PestxLawn team member" className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1738193830098-2d92352a1856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGxhd24lMjBtb3dpbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc3MzI4MDE5MHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional lawn care" className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Licensed & Certified</h2>
              <p className="text-gray-700 mb-6">Our team holds all necessary licenses and certifications to provide safe, effective pest control and lawn care services.</p>
              <ul className="space-y-4">
                {[
                  { title: "State Licensed Pest Control Operators", desc: "All technicians are licensed and regularly trained on the latest techniques" },
                  { title: "Fully Insured", desc: "Comprehensive liability and workers compensation coverage" },
                  { title: "Eco-Friendly Certified", desc: "Trained in environmentally responsible pest control methods" },
                  { title: "Industry Memberships", desc: "Active members of national and state pest control associations" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Experience the PestxLawn Difference</h2>
          <p className="text-xl text-green-50 mb-8">Join thousands of satisfied customers who trust us with their pest control and lawn care needs</p>
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
