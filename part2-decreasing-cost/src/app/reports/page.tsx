"use client";

import { useState } from "react";

export default function Reports() {
  const [transcript, setTranscript] = useState("");
  const [techId, setTechId] = useState("T001");
  const [serviceType, setServiceType] = useState("pest");
  const [report, setReport] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    setLoading(true);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        technicianId: techId,
        jobId: "J001",
        customerName: "Demo Customer",
        serviceType,
        transcript,
      }),
    });

    const data = await res.json();
    setReport(data);
    setReports((prev) => [data, ...prev]);
    setLoading(false);
  };

  const startVoiceRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.start();
    setIsRecording(true);

    // Store reference to stop later
    (window as any).__recognition = recognition;
  };

  const stopVoiceRecording = () => {
    (window as any).__recognition?.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Technician Report Generation</h1>
      <p className="text-gray-500 mb-6">
        Voice-to-text report generation. Speak or type a field report and AI structures it automatically.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">New Report</h2>

          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Technician</label>
              <select
                value={techId}
                onChange={(e) => setTechId(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="T001">Mike Sanders</option>
                <option value="T002">Jake Wilson</option>
                <option value="T003">Carlos Ramirez</option>
                <option value="T004">Derek Brown</option>
                <option value="T005">Steve Hawkins</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="pest">Pest Control</option>
                <option value="lawn">Lawn Care</option>
                <option value="termite">Termite</option>
              </select>
            </div>
          </div>

          <label className="block text-sm text-gray-500 mb-1">
            Voice Transcript / Field Notes
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Speak or type your field report... e.g., 'Just finished the pest treatment at the Johnson residence. Sprayed bifenthrin around the exterior perimeter and applied gel bait in the kitchen. Found some ant activity near the back door, recommend follow up in 30 days. Customer was home and satisfied with the service.'"
            className="w-full border rounded p-3 text-sm h-40 mb-4"
          />

          <div className="flex gap-3">
            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                isRecording
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {isRecording ? "Stop Recording" : "Start Voice Input"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !transcript.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* Output Side */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Structured Report</h2>

          {report?.structuredReport ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 font-medium">Service Performed</p>
                <p>{report.structuredReport.servicePerformed}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Products Used</p>
                <div className="flex flex-wrap gap-1">
                  {report.structuredReport.productsUsed.map((p: string, i: number) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Areas Serviced</p>
                <ul className="list-disc list-inside text-gray-700">
                  {report.structuredReport.areasServiced.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
              {report.structuredReport.issuesFound.length > 0 && (
                <div>
                  <p className="text-gray-500 font-medium">Issues Found</p>
                  <ul className="list-disc list-inside text-red-600">
                    {report.structuredReport.issuesFound.map((a: string, i: number) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="text-gray-500 font-medium">Recommendations</p>
                <ul className="list-disc list-inside text-gray-700">
                  {report.structuredReport.recommendations.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-gray-500 font-medium">Follow-up Needed</p>
                  <p className={report.structuredReport.followUpNeeded ? "text-red-600 font-medium" : ""}>
                    {report.structuredReport.followUpNeeded ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Customer Present</p>
                  <p>{report.structuredReport.customerPresent ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Time on Site</p>
                  <p>{report.structuredReport.timeOnSite} min</p>
                </div>
              </div>
              {report.structuredReport.followUpNotes && (
                <div>
                  <p className="text-gray-500 font-medium">Follow-up Notes</p>
                  <p>{report.structuredReport.followUpNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">
              Submit a voice transcript to generate a structured report.
            </p>
          )}
        </div>
      </div>

      {/* Previous Reports */}
      {reports.length > 1 && (
        <div className="mt-8">
          <h2 className="font-semibold mb-3">Previous Reports</h2>
          <div className="space-y-2">
            {reports.slice(1).map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{r.structuredReport?.servicePerformed}</p>
                  <p className="text-xs text-gray-500">{r.createdAt}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  r.structuredReport?.followUpNeeded ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}>
                  {r.structuredReport?.followUpNeeded ? "Follow-up needed" : "Complete"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
