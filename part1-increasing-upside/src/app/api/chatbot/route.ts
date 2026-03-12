import { NextRequest, NextResponse } from "next/server";
import { getServices } from "@/lib/db";

const SYSTEM_PROMPT = `You are a helpful customer service chatbot for a pest control and lawn care company in the Oklahoma City metro area (Norman, OK). The company has been operating since 1959 and has 60+ years of experience.

You help potential and existing customers with:
- Answering questions about services offered
- Providing general pricing information
- Helping them understand which service is right for their situation
- Scheduling consultations or requesting quotes
- Answering common pest and lawn care questions for Oklahoma

Available services:
${JSON.stringify(getServices(), null, 2)}

Key facts about the company:
- Based in Norman, OK, serving the OKC metro area
- 5-star Google reviews
- Work guaranteed
- Licensed: Pest Control (ODAF 7A), Termite (ODAFF 7B), Ornamental Turf (ODAFF 3A)
- Offers online quotes
- Technicians are constantly trained and certified

Be friendly, professional, and concise. If a customer describes a pest problem, help identify what service they need. Always encourage them to schedule a free inspection or request a quote for specific pricing.

Do not make up pricing — use the price ranges provided. If asked for an exact quote, direct them to request one.`;

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "messages array is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // If no API key, return a mock response for demo purposes
  if (!apiKey) {
    return NextResponse.json({
      role: "assistant",
      content: getMockResponse(messages[messages.length - 1]?.content ?? ""),
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", response.status, error);
      // Fall back to mock response so the user still gets an answer
      return NextResponse.json({
        role: "assistant",
        content: getMockResponse(messages[messages.length - 1]?.content ?? ""),
      });
    }

    const data = await response.json();
    return NextResponse.json({
      role: "assistant",
      content: data.content[0].text,
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    return NextResponse.json({
      role: "assistant",
      content: getMockResponse(messages[messages.length - 1]?.content ?? ""),
    });
  }
}

function getMockResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
    return "Great question! Our pricing depends on your property size and specific needs. For residential pest control, our Four Seasons Protection Plan runs $110-$150 per quarter. Lawn care with our 7-Step program is $75-$140 bimonthly. I'd recommend scheduling a free inspection so we can give you an exact quote. Would you like to set that up?";
  }
  if (msg.includes("ant") || msg.includes("roach") || msg.includes("spider") || msg.includes("bug")) {
    return "I'm sorry to hear you're dealing with pests! In the OKC metro, those are very common, especially during warmer months. Our Four Seasons Protection Plan provides quarterly treatments that target common household pests like ants, roaches, and spiders. We also offer one-time treatments if you need immediate relief. Would you like to schedule a free inspection?";
  }
  if (msg.includes("termite")) {
    return "Termites are a serious concern in Oklahoma. We offer both termite inspections ($150-$300) and the Sentricon baiting system ($1,000-$1,500) for long-term protection. I'd strongly recommend starting with an inspection — we can assess your property and recommend the best course of action. Want me to help you schedule one?";
  }
  if (msg.includes("lawn") || msg.includes("weed") || msg.includes("grass") || msg.includes("fertiliz")) {
    return "Our 7-Step Weed Control & Fertilization program is our most popular lawn service! It includes pre and post-emergent weed control, high-quality fertilizer, and is customized for Oklahoma soil conditions. Treatments are bimonthly and run $75-$140 depending on property size. We also offer soil testing, fungicide treatments, and detailed lawn analysis. Would you like a free lawn evaluation?";
  }
  if (msg.includes("schedule") || msg.includes("appointment") || msg.includes("book")) {
    return "I'd be happy to help you get scheduled! You can request a quote through our online system, or I can have our office team reach out to you. What's the best phone number and time to contact you?";
  }

  return "Thanks for reaching out! We offer comprehensive pest control, lawn care, and termite services across the OKC metro area. We've been protecting Oklahoma homes and businesses for over 60 years. How can I help you today? Feel free to ask about any of our services, pricing, or to schedule a free inspection.";
}
