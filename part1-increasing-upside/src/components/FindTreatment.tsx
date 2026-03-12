"use client";
import { useState } from "react";
import { Bug, Leaf, ShieldCheck, Droplets, CheckCircle, Upload, X, ArrowRight, Phone, Camera, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  issues: string[];
  photo: File | null;
}

interface ServiceRecommendation {
  id: string;
  icon: typeof Bug;
  name: string;
  description: string;
  priceRange: string;
  issues: string[];
}

interface PestAnalysis {
  pestName: string;
  confidence: string;
  riskLevel: string;
  description: string;
  immediateActions: string[];
  recommendedService: string;
  urgency: string;
  seasonalNote: string;
}

export function FindTreatment() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", phone: "", address: "", issues: [], photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pestAnalysis, setPestAnalysis] = useState<PestAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const issueOptions = [
    { value: "ants", label: "Ants", icon: Bug },
    { value: "termites", label: "Termites", icon: ShieldCheck },
    { value: "mosquitoes", label: "Mosquitoes", icon: Droplets },
    { value: "rodents", label: "Rodents", icon: Bug },
    { value: "lawn", label: "Lawn problems", icon: Leaf },
    { value: "not-sure", label: "Not sure", icon: Bug },
  ];

  const serviceRecommendations: ServiceRecommendation[] = [
    { id: "quarterly-pest", icon: Bug, name: "Quarterly Pest Protection Plan", description: "Comprehensive pest control with quarterly treatments to keep your home pest-free year-round.", priceRange: "$99 - $149/quarter", issues: ["ants", "rodents", "not-sure"] },
    { id: "four-seasons", icon: ShieldCheck, name: "Four Seasons Protection Plan", description: "Year-round pest protection covering all major Oklahoma pests with seasonal treatments tailored to current threats.", priceRange: "$129 - $179/quarter", issues: ["ants", "rodents", "not-sure", "mosquitoes"] },
    { id: "mosquito-treatment", icon: Droplets, name: "Mosquito Yard Treatment", description: "Effective barrier spray treatment to eliminate mosquitoes and protect your outdoor spaces.", priceRange: "$75 - $125/month", issues: ["mosquitoes"] },
    { id: "termite-inspection", icon: ShieldCheck, name: "Termite Inspection & Treatment", description: "Professional termite inspection with comprehensive treatment options to protect your investment.", priceRange: "$150 - $300", issues: ["termites"] },
    { id: "sentricon", icon: ShieldCheck, name: "Sentricon Termite System", description: "Industry-leading baiting system that eliminates the entire termite colony, not just individual termites. 24/7 monitoring included.", priceRange: "$1,200 - $3,000", issues: ["termites"] },
    { id: "one-time-pest", icon: Bug, name: "One-Time Pest Treatment", description: "Targeted single treatment for immediate pest problems. Includes inspection, treatment, and 30-day follow-up.", priceRange: "$150 - $250", issues: ["ants", "rodents", "mosquitoes", "not-sure"] },
    { id: "lawn-fertilization", icon: Leaf, name: "Lawn Fertilization Program", description: "Custom fertilization program with weed control to give you a lush, healthy lawn.", priceRange: "$60 - $120/month", issues: ["lawn"] },
    { id: "soil-testing", icon: Leaf, name: "Soil Testing & Analysis", description: "Professional soil testing to identify nutrient deficiencies and pH imbalances.", priceRange: "$50 - $85", issues: ["lawn", "not-sure"] },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIssueToggle = (issue: string) => {
    setFormData((prev) => {
      const issues = prev.issues.includes(issue)
        ? prev.issues.filter((i) => i !== issue)
        : [...prev.issues, issue];
      return { ...prev, issues };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => { setPhotoPreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If a photo was uploaded, run AI analysis
    if (photoPreview) {
      setAnalyzing(true);
      setAnalysisError("");
      try {
        const issueDescription = formData.issues
          .map((i) => issueOptions.find((o) => o.value === i)?.label)
          .filter(Boolean)
          .join(", ");

        const res = await fetch("/api/pest-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: photoPreview,
            description: `Issues reported: ${issueDescription}. Location: ${formData.address}`,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.pestName) {
            setPestAnalysis(data);
          }
        }
      } catch {
        setAnalysisError("Photo analysis unavailable. Showing recommendations based on your selections.");
      } finally {
        setAnalyzing(false);
      }
    }

    setShowRecommendations(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRecommendedServices = () => {
    // Start with services matching user-selected issues
    let recommended = formData.issues.length > 0
      ? serviceRecommendations.filter((service) =>
          service.issues.some((issue) => formData.issues.includes(issue))
        )
      : serviceRecommendations.slice(0, 3);

    // If AI analysis recommended a service, find a matching one and put it first
    if (pestAnalysis?.recommendedService) {
      const aiServiceName = pestAnalysis.recommendedService.toLowerCase();
      const aiMatch = serviceRecommendations.find((s) =>
        s.name.toLowerCase().includes(aiServiceName) ||
        aiServiceName.includes(s.name.toLowerCase())
      );

      if (aiMatch) {
        // Remove it from its current position if present, and prepend it
        recommended = recommended.filter((s) => s.id !== aiMatch.id);
        recommended = [{ ...aiMatch, description: `🤖 AI Recommended: ${aiMatch.description}` }, ...recommended];
      }
    }

    return recommended.length > 0 ? recommended : serviceRecommendations.slice(0, 3);
  };

  const resetForm = () => {
    setShowRecommendations(false);
    setFormData({ name: "", email: "", phone: "", address: "", issues: [], photo: null });
    setPhotoPreview(null);
    setPestAnalysis(null);
    setAnalysisError("");
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Find the Right Treatment</h1>
          <p className="text-xl text-gray-700">Describe your pest or lawn problem and get personalized service recommendations</p>
        </div>
      </section>

      {!showRecommendations ? (
        <section className="py-12 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Tell Us About Your Issue</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {[
                  { id: "name", label: "Name *", type: "text", placeholder: "John Smith" },
                  { id: "email", label: "Email *", type: "email", placeholder: "john@example.com" },
                  { id: "phone", label: "Phone *", type: "tel", placeholder: "(555) 123-4567" },
                  { id: "address", label: "Address or Zip Code *", type: "text", placeholder: "73069" },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-semibold text-gray-900 mb-2">{field.label}</label>
                    <input type={field.type} id={field.id} name={field.id} required value={(formData as unknown as Record<string, string>)[field.id] || ""} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={field.placeholder} />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">What issue are you experiencing? *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {issueOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.issues.includes(option.value);
                    return (
                      <button key={option.value} type="button" onClick={() => handleIssueToggle(option.value)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${isSelected ? "border-green-600 bg-green-50 text-green-700" : "border-gray-300 hover:border-green-400 text-gray-700"}`}>
                        <Icon className={`w-8 h-8 mb-2 ${isSelected ? "text-green-600" : "text-gray-600"}`} />
                        <span className="text-sm font-semibold">{option.label}</span>
                        {isSelected && <CheckCircle className="w-5 h-5 text-green-600 mt-1" />}
                      </button>
                    );
                  })}
                </div>
                {formData.issues.length === 0 && <p className="text-sm text-red-600 mt-2">Please select at least one issue</p>}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Upload a Photo (Optional)</label>
                <p className="text-sm text-gray-600 mb-3">Help us identify your issue by uploading a photo</p>
                {!photoPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="relative inline-block">
                    <img src={photoPreview} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
                    <button type="button" onClick={removePhoto} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={formData.issues.length === 0 || analyzing}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed">
                {analyzing ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Your Photo...</>
                ) : (
                  <>{photoPreview ? <Camera className="w-5 h-5 mr-2" /> : null}Get My Recommendation <ArrowRight className="ml-2 w-5 h-5" /></>
                )}
              </button>
              {photoPreview && !analyzing && (
                <p className="text-center text-sm text-gray-500 mt-2">Your photo will be analyzed by AI to help identify the issue</p>
              )}
            </form>
          </div>
        </section>
      ) : (
        <section className="py-12 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Recommended Services For You</h2>
              <p className="text-xl text-gray-600">Based on your needs, here are our top recommendations</p>
            </div>

            {pestAnalysis && (
              <div className="bg-white border-2 border-green-200 rounded-2xl p-8 mb-10 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                    <Camera className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Photo Analysis</h3>
                    <p className="text-sm text-gray-500">Powered by AI image recognition</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{pestAnalysis.pestName}</h4>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          pestAnalysis.confidence === "high" ? "bg-green-100 text-green-700" :
                          pestAnalysis.confidence === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {pestAnalysis.confidence} confidence
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          pestAnalysis.riskLevel === "high" ? "bg-red-100 text-red-700" :
                          pestAnalysis.riskLevel === "moderate" ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {pestAnalysis.riskLevel} risk
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          pestAnalysis.urgency === "urgent" ? "bg-red-100 text-red-700" :
                          pestAnalysis.urgency === "soon" ? "bg-orange-100 text-orange-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {pestAnalysis.urgency} priority
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{pestAnalysis.description}</p>
                    {pestAnalysis.seasonalNote && (
                      <p className="text-sm text-gray-500 italic">{pestAnalysis.seasonalNote}</p>
                    )}
                  </div>

                  <div>
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-orange-500" /> Immediate Actions
                      </h5>
                      <ul className="space-y-1.5">
                        {pestAnalysis.immediateActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-800">Recommended Service:</p>
                      <p className="text-green-700 font-bold">{pestAnalysis.recommendedService}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {analysisError && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm mb-6">
                {analysisError}
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {getRecommendedServices().map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-green-500 hover:shadow-xl transition-all flex flex-col">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-4">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-4 flex-1">{service.description}</p>
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">Estimated Price:</span>
                      <p className="text-xl font-bold text-green-600">{service.priceRange}</p>
                    </div>
                    <Link href={`/contact?service=${service.id}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}`}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold inline-block text-center mt-auto">
                      Book This Service
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-8 text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Need a Custom Solution?</h3>
              <p className="text-gray-700 mb-6">Our experts can create a personalized service plan tailored to your specific needs</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+15551234567" className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  <Phone className="w-5 h-5 mr-2" /> Call (555) 123-4567
                </a>
                <button onClick={resetForm} className="inline-flex items-center justify-center bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors font-semibold">
                  Start New Inquiry
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Your Information:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-600">Name:</span><span className="ml-2 font-semibold text-gray-900">{formData.name}</span></div>
                <div><span className="text-gray-600">Email:</span><span className="ml-2 font-semibold text-gray-900">{formData.email}</span></div>
                <div><span className="text-gray-600">Phone:</span><span className="ml-2 font-semibold text-gray-900">{formData.phone}</span></div>
                <div><span className="text-gray-600">Location:</span><span className="ml-2 font-semibold text-gray-900">{formData.address}</span></div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
