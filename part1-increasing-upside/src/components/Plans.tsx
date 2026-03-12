import Link from "next/link";
import { Bug, Shield, Droplets, Leaf, CheckCircle, Calendar, Phone, ArrowRight } from "lucide-react";

interface Plan {
  id: string;
  icon: typeof Bug;
  name: string;
  category: string;
  description: string;
  price: string;
  features: string[];
  schedule?: string;
  popular?: boolean;
}

export function Plans() {
  const pestControlPlans: Plan[] = [
    {
      id: "four-seasons", icon: Calendar, name: "Four Seasons Protection Plan", category: "Quarterly Service",
      description: "Comprehensive year-round pest protection with treatments designed for each season's specific pest challenges.",
      price: "$99/quarter", schedule: "4 treatments per year (every 3 months)", popular: true,
      features: ["Interior and exterior treatments", "Protection against 30+ common pests", "Seasonal pest prevention strategies", "Free re-treatments if pests return", "Spider web removal", "Wasp nest removal (up to 10 ft)"],
    },
    {
      id: "termite-protection", icon: Shield, name: "Termite Protection & Treatment", category: "Annual Program",
      description: "Advanced termite monitoring and elimination using the Sentricon\u00AE Always Active\u2122 baiting system.",
      price: "$499/year", schedule: "Initial installation + quarterly monitoring",
      features: ["Sentricon\u00AE Always Active\u2122 system", "Eliminates entire termite colonies", "Continuous year-round protection", "Quarterly monitoring visits", "Damage repair assistance", "Transferable warranty"],
    },
    {
      id: "proplus", icon: Bug, name: "ProPlus Plan", category: "Monthly Service",
      description: "Our most comprehensive protection plan with monthly treatments for maximum pest control and prevention.",
      price: "$75/month", schedule: "12 treatments per year (monthly)",
      features: ["Monthly interior & exterior service", "Priority emergency response", "Mosquito barrier treatments included", "Fire ant mound treatments", "Rodent monitoring and control", "100% satisfaction guarantee"],
    },
    {
      id: "one-time", icon: Bug, name: "One-Time Treatment", category: "Single Service",
      description: "Professional one-time pest treatment for immediate pest problems.",
      price: "$150", schedule: "Single visit",
      features: ["Thorough interior and exterior treatment", "Targeted pest elimination", "30-day warranty", "Treatment plan customized to your needs", "Detailed service report"],
    },
    {
      id: "commercial", icon: Bug, name: "Commercial Treatments", category: "Custom Schedule",
      description: "Customized pest management programs for businesses, restaurants, offices, and multi-unit properties.",
      price: "Custom pricing", schedule: "Monthly, bi-monthly, or quarterly",
      features: ["Tailored to your industry requirements", "Food service compliance documentation", "After-hours service available", "Detailed service logs and reports", "Integrated Pest Management (IPM)", "Emergency response priority"],
    },
  ];

  const lawnCarePlans: Plan[] = [
    {
      id: "seven-step", icon: Leaf, name: "7-Step Weed Control & Fertilization", category: "Annual Program",
      description: "Our premium lawn care program with 7 precisely timed treatments for a thick, weed-free, healthy lawn.",
      price: "$60-120/month", schedule: "7 treatments throughout the year", popular: true,
      features: ["Early spring pre-emergent weed control", "Spring fertilization and greening", "Late spring weed control and feeding", "Summer heat stress protection", "Fall fertilization for root development", "Late fall winterizer application", "Blanket weed control throughout season"],
    },
    {
      id: "lawn-analysis", icon: Leaf, name: "Detailed Lawn Analysis", category: "One-Time Service",
      description: "Professional evaluation of your lawn's health, including soil testing and customized treatment recommendations.",
      price: "$85", schedule: "Single visit with detailed report",
      features: ["Comprehensive lawn inspection", "Soil pH and nutrient testing", "Grass type identification", "Disease and pest assessment", "Detailed written report", "Customized treatment plan"],
    },
    {
      id: "fungicide", icon: Droplets, name: "Lawn Disease Control Program", category: "Seasonal Service",
      description: "Preventative and curative fungicide treatments to protect your lawn from common lawn diseases.",
      price: "$75/treatment", schedule: "3-5 treatments per season (as needed)",
      features: ["Disease identification and diagnosis", "Targeted fungicide applications", "Preventative treatments during high-risk periods", "Cultural practice recommendations", "Follow-up monitoring"],
    },
    {
      id: "lawn-insect", icon: Bug, name: "Lawn Insect Control", category: "As-Needed Service",
      description: "Targeted treatments for lawn-damaging insects including grubs, chinch bugs, armyworms, and fire ants.",
      price: "$65/treatment", schedule: "Applied when pests are detected",
      features: ["Grub prevention and control", "Chinch bug treatments", "Armyworm elimination", "Fire ant mound treatments", "Safe for pets and children"],
    },
    {
      id: "soil-testing", icon: Leaf, name: "Professional Soil Testing", category: "One-Time Service",
      description: "Laboratory soil analysis to determine pH levels, nutrient deficiencies, and optimal treatment strategies.",
      price: "$50", schedule: "Single service with lab results",
      features: ["Laboratory-grade soil analysis", "pH level testing", "Nutrient deficiency identification", "Lime requirement calculations", "Fertilizer recommendations", "Results within 7-10 days"],
    },
    {
      id: "commercial-lawn", icon: Leaf, name: "Commercial Lawn Programs", category: "Custom Schedule",
      description: "Year-round lawn care programs for commercial properties, HOAs, apartment complexes, and business campuses.",
      price: "Custom pricing", schedule: "Customized to property needs",
      features: ["Customized treatment schedules", "Multi-property discounts available", "Consistent service quality", "Seasonal color programs", "Landscape bed maintenance options", "Dedicated account manager"],
    },
  ];

  const renderPlanCard = (plan: Plan) => {
    const Icon = plan.icon;
    return (
      <div
        key={plan.id}
        className={`bg-white rounded-2xl overflow-hidden transition-all ${
          plan.popular ? "border-4 border-green-500 shadow-2xl scale-105" : "border-2 border-gray-200 hover:border-green-400 hover:shadow-xl"
        }`}
      >
        {plan.popular && (
          <div className="bg-green-500 text-white text-center py-2 font-bold text-sm">MOST POPULAR</div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-4">
            <Icon className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <div className="text-sm text-green-600 font-semibold mb-3">{plan.category}</div>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          <div className="mb-4">
            <div className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</div>
            {plan.schedule && (
              <div className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {plan.schedule}
              </div>
            )}
          </div>
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            Schedule Service
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Service Plans & Programs</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Choose from our comprehensive pest control and lawn care plans designed to protect your property year-round
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pest Control Plans</h2>
            <p className="text-xl text-gray-600">Preventative and maintenance packages to keep your property pest-free</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {pestControlPlans.map(renderPlanCard)}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lawn Care Plans</h2>
            <p className="text-xl text-gray-600">Residential and commercial programs for beautiful, healthy lawns</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lawnCarePlans.map(renderPlanCard)}
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Not Sure Which Plan Is Right for You?</h2>
          <p className="text-xl text-green-50 mb-8">Our experts can help you choose the perfect plan for your property and budget</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-treatment" className="inline-flex items-center justify-center bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold">
              Find the Right Treatment <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="tel:+15551234567" className="inline-flex items-center justify-center bg-green-700 text-white px-8 py-4 rounded-lg hover:bg-green-800 transition-colors text-lg font-semibold">
              <Phone className="mr-2 w-5 h-5" /> Call (555) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
