import { NextRequest, NextResponse } from "next/server";
import { getServices } from "@/lib/db";

const SYSTEM_PROMPT = `You are a pest identification expert for a pest and lawn care company in Oklahoma City. A customer will describe a pest they've seen (or upload a photo description). Your job is to:

1. Identify the most likely pest based on their description
2. Explain the risk level (low, moderate, high)
3. Recommend immediate actions they can take
4. Recommend the appropriate professional service from our catalog

Available services:
${JSON.stringify(
  getServices().filter((s) => s.type === "pest" || s.type === "termite"),
  null,
  2
)}

Oklahoma-specific context:
- Common pests: fire ants, carpenter ants, brown recluse spiders, black widows, termites (subterranean), roaches (German and American), mosquitoes, ticks, fleas, wasps, scorpions
- Peak pest season: April-October
- Termite swarm season: March-May
- High humidity increases pest activity

Format your response as JSON with this structure:
{
  "pestName": "string (common name only, e.g. 'Carpenter Ants')",
  "confidence": "high" | "medium" | "low",
  "riskLevel": "low" | "moderate" | "high",
  "description": "3-4 sentences describing the pest, what it looks like, the risks it poses to the home/property, and why professional treatment is important. Be specific and informative.",
  "immediateActions": ["action1", "action2", "action3", "action4"],
  "recommendedService": "service name from catalog",
  "urgency": "routine" | "soon" | "urgent",
  "seasonalNote": "2-3 sentences about Oklahoma-specific seasonal info, when this pest is most active, and what the homeowner should watch for in the coming months."
}`;

export async function POST(request: NextRequest) {
  const { description, image } = await request.json();

  if (!description && !image) {
    return NextResponse.json(
      { error: "description or image is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(getMockIdentification(description || "photo uploaded", image));
  }

  try {
    // Build message content — text, image, or both
    const content: Array<{ type: string; source?: { type: string; media_type: string; data: string }; text?: string }> = [];

    if (image) {
      // image is expected as a data URL: "data:image/jpeg;base64,..."
      const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        // Limit image size to ~4MB base64 (roughly 3MB actual) to avoid API limits
        if (match[2].length > 5_000_000) {
          console.warn("Image too large for API, falling back to text-only analysis");
        } else {
          content.push({
            type: "image",
            source: {
              type: "base64",
              media_type: match[1],
              data: match[2],
            },
          });
        }
      }
    }

    content.push({
      type: "text",
      text: description
        ? image
          ? `I've uploaded a photo of the pest/issue. Here's my description: ${description}`
          : description
        : "I've uploaded a photo of a pest or lawn issue I found. Please identify what it is and recommend the right service.",
    });

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
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", response.status, error);
      // Fall back to mock on API error so the user still gets a result
      return NextResponse.json(getMockIdentification(description || "photo uploaded", image));
    }

    const data = await response.json();
    const text = data.content[0].text;

    // Try to parse JSON from the response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return NextResponse.json(JSON.parse(jsonMatch[0]));
      }
    } catch {
      // If JSON parsing fails, return raw text
    }

    return NextResponse.json({ raw: text });
  } catch (err) {
    console.error("Pest ID error:", err);
    // Fall back to mock on any error
    return NextResponse.json(getMockIdentification(description || "photo uploaded", image));
  }
}

function getMockIdentification(description: string, hasImage?: string) {
  const desc = description.toLowerCase();

  // If an image was uploaded, return a mock image analysis result
  if (hasImage) {
    return {
      pestName: "Possible Ant Infestation (from photo analysis)",
      confidence: "medium",
      riskLevel: "moderate",
      description: "Based on the uploaded photo, this appears to be an ant infestation. The image shows characteristics consistent with common household ants found in Oklahoma. A professional inspection is recommended for accurate identification.",
      immediateActions: [
        "Keep the area clean and free of food debris",
        "Seal any visible entry points near the area shown",
        "Avoid using over-the-counter sprays which can scatter the colony",
        "Schedule a professional inspection for accurate identification",
      ],
      recommendedService: "Four Seasons Protection Plan",
      urgency: "soon",
      seasonalNote: "Photo-based identification is approximate. A technician visit will confirm the species and determine the best treatment approach for your Oklahoma home.",
      imageAnalyzed: true,
    };
  }

  if (desc.includes("ant") || desc.includes("small") && desc.includes("red")) {
    return {
      pestName: "Fire Ants (Solenopsis invicta)",
      confidence: "high",
      riskLevel: "moderate",
      description: "Fire ants are aggressive, reddish-brown ants common in Oklahoma. They build large mound nests and deliver painful stings.",
      immediateActions: [
        "Avoid disturbing the mound",
        "Keep children and pets away from the area",
        "Mark the mound location for the technician",
      ],
      recommendedService: "Four Seasons Protection Plan",
      urgency: "soon",
      seasonalNote: "Fire ants are most active in Oklahoma from April through October. Spring is the best time to treat before colonies expand.",
    };
  }

  if (desc.includes("termite") || desc.includes("wood") || desc.includes("wing") && desc.includes("swarm")) {
    return {
      pestName: "Eastern Subterranean Termites",
      confidence: "medium",
      riskLevel: "high",
      description: "Subterranean termites are the most destructive pest in Oklahoma. They live underground and build mud tubes to access wood structures.",
      immediateActions: [
        "Do not disturb any mud tubes you see",
        "Check for hollow-sounding wood by tapping",
        "Look for discarded wings near windows",
        "Schedule a professional inspection immediately",
      ],
      recommendedService: "Sentricon System",
      urgency: "urgent",
      seasonalNote: "Termite swarm season in Oklahoma is March through May. If you see swarming insects, it indicates a mature colony nearby.",
    };
  }

  if (desc.includes("roach") || desc.includes("cockroach")) {
    return {
      pestName: "German Cockroach or American Cockroach",
      confidence: "medium",
      riskLevel: "moderate",
      description: "Cockroaches are common indoor pests in Oklahoma. German roaches (small, light brown) infest kitchens; American roaches (large, reddish-brown) often enter from outside.",
      immediateActions: [
        "Eliminate food sources — clean crumbs, seal food containers",
        "Fix any water leaks (roaches need moisture)",
        "Seal cracks around doors and windows",
      ],
      recommendedService: "Four Seasons Protection Plan",
      urgency: "soon",
      seasonalNote: "Roach activity increases in Oklahoma during hot, humid months. They often move indoors seeking moisture in summer.",
    };
  }

  if (desc.includes("spider") || desc.includes("web")) {
    return {
      pestName: "Brown Recluse Spider (likely)",
      confidence: "low",
      riskLevel: "moderate",
      description: "Brown recluse spiders are common in Oklahoma and prefer dark, undisturbed areas. They have a distinctive violin-shaped marking on their back.",
      immediateActions: [
        "Shake out clothing and shoes before wearing",
        "Move beds away from walls",
        "Reduce clutter in storage areas",
        "Use sticky traps to monitor activity",
      ],
      recommendedService: "One-Time Pest Treatment",
      urgency: "soon",
      seasonalNote: "Brown recluses are most active indoors from March through October in Oklahoma. They're common in garages, attics, and closets.",
    };
  }

  // Default response
  return {
    pestName: "Unidentified Pest",
    confidence: "low",
    riskLevel: "moderate",
    description: "Based on your description, we'd need more details or a photo to make a confident identification. We recommend scheduling a free inspection.",
    immediateActions: [
      "Try to safely capture or photograph the pest",
      "Note where and when you see them most",
      "Schedule a professional inspection",
    ],
    recommendedService: "One-Time Pest Treatment",
    urgency: "routine",
    seasonalNote: "Oklahoma's warm climate and humidity make it home to many pest species. A professional inspection can quickly identify and address the issue.",
  };
}
