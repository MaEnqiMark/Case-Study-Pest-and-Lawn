import { NextRequest, NextResponse } from "next/server";

// In-memory report storage for demo
const reports: {
  id: string;
  technicianId: string;
  jobId: string;
  customerName: string;
  serviceType: string;
  rawTranscript: string;
  structuredReport: {
    servicePerformed: string;
    productsUsed: string[];
    areasServiced: string[];
    issuesFound: string[];
    recommendations: string[];
    followUpNeeded: boolean;
    followUpNotes: string;
    customerPresent: boolean;
    timeOnSite: number;
  } | null;
  createdAt: string;
}[] = [];

export async function POST(request: NextRequest) {
  const { technicianId, jobId, customerName, serviceType, transcript } =
    await request.json();

  if (!transcript) {
    return NextResponse.json(
      { error: "transcript is required" },
      { status: 400 }
    );
  }

  const reportId = `R${Date.now()}`;

  // Use Claude to structure the voice transcript, or mock it
  const apiKey = process.env.ANTHROPIC_API_KEY;
  let structuredReport = null;

  if (apiKey) {
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
          system: `You are a report structuring assistant for a pest and lawn care company. Convert the technician's voice transcript into a structured JSON report. Return ONLY valid JSON with this structure:
{
  "servicePerformed": "brief description",
  "productsUsed": ["product1", "product2"],
  "areasServiced": ["area1", "area2"],
  "issuesFound": ["issue1"],
  "recommendations": ["rec1"],
  "followUpNeeded": true/false,
  "followUpNotes": "string or empty",
  "customerPresent": true/false,
  "timeOnSite": minutes as number
}`,
          messages: [{ role: "user", content: transcript }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredReport = JSON.parse(jsonMatch[0]);
        }
      }
    } catch {
      // Fall through to mock
    }
  }

  // Mock structured report if no API key or API failed
  if (!structuredReport) {
    structuredReport = mockStructuredReport(transcript, serviceType);
  }

  const report = {
    id: reportId,
    technicianId: technicianId ?? "unknown",
    jobId: jobId ?? "unknown",
    customerName: customerName ?? "unknown",
    serviceType: serviceType ?? "general",
    rawTranscript: transcript,
    structuredReport,
    createdAt: new Date().toISOString(),
  };

  reports.push(report);

  return NextResponse.json(report);
}

export async function GET() {
  return NextResponse.json({
    totalReports: reports.length,
    reports: reports.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
}

function mockStructuredReport(transcript: string, serviceType: string) {
  const t = transcript.toLowerCase();

  const productsUsed: string[] = [];
  if (t.includes("bifenthrin") || t.includes("spray")) productsUsed.push("Bifenthrin 7.9F");
  if (t.includes("bait") || t.includes("gel")) productsUsed.push("Fipronil Gel Bait");
  if (t.includes("fertiliz")) productsUsed.push("Granular Fertilizer 24-0-11");
  if (t.includes("herbicide") || t.includes("weed")) productsUsed.push("Post-Emergent Herbicide (2,4-D)");
  if (productsUsed.length === 0) {
    productsUsed.push(
      serviceType === "pest" ? "Bifenthrin 7.9F" : "Granular Fertilizer 24-0-11"
    );
  }

  return {
    servicePerformed:
      serviceType === "pest"
        ? "General pest treatment — interior and exterior perimeter spray"
        : "Lawn fertilization and weed control application",
    productsUsed,
    areasServiced:
      serviceType === "pest"
        ? ["Exterior perimeter", "Garage", "Kitchen baseboards", "Bathrooms"]
        : ["Front lawn", "Back yard", "Side strips"],
    issuesFound: t.includes("issue") || t.includes("problem") || t.includes("found")
      ? ["Minor pest activity noted near foundation"]
      : [],
    recommendations: t.includes("recommend") || t.includes("suggest")
      ? ["Schedule follow-up in 30 days", "Seal gap under garage door"]
      : ["Continue regular treatment schedule"],
    followUpNeeded: t.includes("follow up") || t.includes("come back"),
    followUpNotes: t.includes("follow up") ? "Re-treat in 2-4 weeks" : "",
    customerPresent: t.includes("customer") || t.includes("homeowner") || t.includes("spoke"),
    timeOnSite: serviceType === "pest" ? 35 : 45,
  };
}
