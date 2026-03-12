import Link from "next/link";
import { Bug, Leaf, Droplets, TreeDeciduous, Home, Building, ArrowRight, Sparkles, Calendar, CheckCircle, Shield, Phone } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Bug,
      title: "Pest Control",
      description: "Professional pest elimination and prevention to keep your home and business pest-free year-round.",
      popularServices: ["Termite Protection", "Rodent Control", "Ant & Spider Treatment", "Bed Bug Treatment", "Emergency Pest Removal", "Monthly Prevention"],
      tagColors: [
        "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
        "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      ],
      featuredPlan: { name: "Four Seasons Protection Plan", description: "Quarterly treatments designed for each season's specific pest challenges with 100% satisfaction guarantee.", price: "$99/quarter" },
      buttonText: "View Pest Plans",
    },
    {
      icon: Leaf,
      title: "Lawn Care",
      description: "Expert lawn maintenance and fertilization services for a healthy, beautiful lawn you'll be proud of.",
      popularServices: ["7 Step Fertilization Program", "Weed Control", "Lawn Disease Treatment", "Soil Testing"],
      tagColors: [
        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100",
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
      ],
      featuredPlan: { name: "Annual Lawn Care Program", description: "Comprehensive 7-step weed control and fertilization program for thick, weed-free grass all year long.", price: "$60-120/month" },
      buttonText: "View Lawn Plans",
    },
    {
      icon: Droplets,
      title: "Mosquito & Tick Control",
      description: "Protect your family from disease-carrying insects with our effective outdoor barrier treatments.",
      popularServices: ["Barrier Spray Treatments", "Mosquito Misting Systems", "Tick Prevention", "Special Event Treatments"],
      tagColors: [
        "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
        "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
        "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      ],
      featuredPlan: { name: "Mosquito Yard Treatment", description: "Monthly barrier spray treatments to eliminate mosquitoes and ticks.", price: "$75-125/month" },
      buttonText: "View Mosquito Plans",
    },
    {
      icon: TreeDeciduous,
      title: "Tree & Shrub Care",
      description: "Professional plant health care to ensure your landscape's trees and shrubs stay beautiful and healthy.",
      popularServices: ["Disease Diagnosis", "Insect Management", "Deep Root Fertilization", "Pruning Services"],
      tagColors: [
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100",
      ],
      featuredPlan: { name: "Tree & Shrub Protection", description: "Year-round care program including fertilization, pest management, and disease prevention.", price: "Custom pricing" },
      buttonText: "Get Custom Quote",
    },
    {
      icon: Home,
      title: "Residential Services",
      description: "Complete home protection and lawn care packages customized for homeowners and families.",
      popularServices: ["Year-Round Protection", "Family & Pet Safe", "Free Inspections", "Flexible Scheduling"],
      tagColors: [
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      ],
      featuredPlan: { name: "ProPlus Residential Plan", description: "Our most comprehensive package combining monthly pest control with complete lawn care services.", price: "$75/month" },
      buttonText: "View Residential Plans",
    },
    {
      icon: Building,
      title: "Commercial Services",
      description: "Specialized pest control and grounds maintenance solutions for businesses and property managers.",
      popularServices: ["Restaurant Compliance", "Office Buildings", "Multi-Unit Properties", "After-Hours Service"],
      tagColors: [
        "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
        "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
        "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100",
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      ],
      featuredPlan: { name: "Commercial Maintenance", description: "Customized programs for businesses with flexible scheduling and priority service.", price: "Custom pricing" },
      buttonText: "Schedule Consultation",
    },
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Professional pest control and lawn care solutions designed to protect your property and enhance your outdoor spaces.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all shadow-md flex flex-col">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mr-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{service.title}</h2>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">Popular Services</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {service.popularServices.slice(0, 4).map((tag, tagIndex) => (
                        <span key={tagIndex} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${service.tagColors[tagIndex]}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 mb-4 border border-green-200 flex-grow">
                    <div className="flex items-center mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-green-600 mr-1.5" />
                      <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Featured Plan</span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-1.5">{service.featuredPlan.name}</h4>
                    <p className="text-xs text-gray-700 mb-2">{service.featuredPlan.description}</p>
                    <div className="text-xl font-bold text-green-600">{service.featuredPlan.price}</div>
                  </div>
                  <Link href="/plans" className="w-full inline-flex items-center justify-center bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm mt-auto">
                    {service.buttonText}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Service Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple, straightforward, and effective</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Contact Us", desc: "Call or fill out our online form for a free consultation" },
              { num: "2", title: "Free Inspection", desc: "We assess your property and identify any issues" },
              { num: "3", title: "Custom Plan", desc: "Receive a tailored treatment plan and transparent pricing" },
              { num: "4", title: "Service & Support", desc: "Enjoy ongoing protection with regular maintenance" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full text-2xl font-bold mb-4">{step.num}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Protect Your Property?</h2>
          <p className="text-xl text-green-50 mb-8">Contact us today for a free inspection and customized service quote</p>
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

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Not Sure Which Plan Is Right for You?</h2>
          <p className="text-xl text-gray-600 mb-8">Our experts can help you choose the perfect plan for your property and budget</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-treatment" className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold">
              Find the Right Treatment <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="tel:+15551234567" className="inline-flex items-center justify-center border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors text-lg font-semibold">
              <Phone className="mr-2 w-5 h-5" /> Call (555) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
