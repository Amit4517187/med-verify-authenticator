import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import ResultsPage from "../pages/ResultsPage";
import { LanguageProvider } from "../contexts/LanguageContext";

// Mock useLocation to provide result state
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

// Mock html2canvas and jspdf as they cause issues in JSDOM
vi.mock("html2canvas", () => ({
  default: vi.fn(),
}));
vi.mock("jspdf", () => ({
  default: vi.fn().mockImplementation(() => ({
    text: vi.fn(),
    save: vi.fn(),
    addImage: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    addPage: vi.fn(),
  })),
}));

const renderResults = (state: Record<string, unknown>) => {
  (useLocation as Mock).mockReturnValue({ state });
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <ResultsPage />
      </LanguageProvider>
    </MemoryRouter>
  );
};

describe("ResultsPage Behavior", () => {
  it("renders verified_database status correctly", () => {
    const mockState = {
      status: "verified_database",
      drugName: "TestMed",
      composition: "TestComp",
      message: "This should be hidden when evidence is present",
      evidence: {
        medicine_identified: "Yes",
        database_match: "Indian Registry",
        regulatory_status: "Safe",
        packaging_analysis: "Low Risk",
        barcode_match: "Verified",
        ocr_confidence: "High"
      }
    };

    renderResults(mockState);
    
    expect(screen.getAllByText("TestMed").length).toBeGreaterThan(0);
    expect(screen.getByText("Verified Database Match")).toBeDefined();
    expect(screen.getByText("LOW — Database Match")).toBeDefined();
    expect(screen.getByText("Medicine Identified")).toBeDefined();
  });

  it("renders unable_to_verify status correctly", () => {
    const mockState = {
      status: "unable_to_verify",
      drugName: "UnknownMed",
      composition: "Unknown",
      message: "This should be hidden",
      evidence: {
        medicine_identified: "No",
        database_match: "None",
        regulatory_status: "Unknown",
        packaging_analysis: "High Risk",
        barcode_match: "Not Found",
        ocr_confidence: "Low"
      }
    };

    renderResults(mockState);
    
    expect(screen.getAllByText("UnknownMed").length).toBeGreaterThan(0);
    expect(screen.getByText("Unable to Verify")).toBeDefined();
    expect(screen.getByText("UNKNOWN — Not found in databases")).toBeDefined();
  });

  it("renders evidence breakdown correctly", () => {
    const mockState = {
      status: "verified_global",
      drugName: "SafeMed",
      composition: "SafeComp",
      message: "Safe",
      evidence: {
        medicine_identified: "Yes",
        database_match: "Official",
        regulatory_status: "Safe",
        packaging_analysis: "Pass",
        barcode_match: "N/A",
        ocr_confidence: "N/A"
      }
    };

    renderResults(mockState);
    
    expect(screen.getByText("Evidence Breakdown")).toBeDefined();
    expect(screen.getByText("Medicine Identified")).toBeDefined();
    expect(screen.getByText("Yes")).toBeDefined();
  });
});
