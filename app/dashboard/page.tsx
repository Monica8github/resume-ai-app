"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import * as pdfjsLib from "pdfjs-dist"
import { 
  FileSearch, ArrowLeft, Upload, FileText, X, RotateCcw, 
  Sparkles, Shield, Copy, Download, Zap, Check, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ResumeUploader } from "@/components/resume-uploader"
import { AnalysisResults } from "@/components/analysis-results"
import { AnalysisSkeleton } from "@/components/analysis-skeleton"
import { useToast } from "@/hooks/use-toast"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export interface SectionFeedback {
  section: string
  status: "strong" | "good" | "needs-work"
  note: string
}

export interface AnalysisResult {
  matchScore: number
  matchLevel: string
  atsScore: number
  keywordMatch: number
  roleFit: number
  skillGaps: { skill: string; priority: "high" | "medium" | "low" }[]
  matchedSkills: string[]
  suggestions: { title: string; description: string }[]
  sectionFeedback: SectionFeedback[]
  atsKeywords: string[]
  recruiterImpression: string
}

const LOADING_STEPS = [
  { text: "Reading resume...", duration: 1200, icon: FileText },
  { text: "Extracting skills...", duration: 1500, icon: Zap },
  { text: "Matching requirements...", duration: 1800, icon: FileSearch },
  { text: "Generating AI insights...", duration: 2000, icon: Sparkles },
]

const SAMPLE_JD = `We are looking for a Data Analyst with:
- 3+ years of experience in data analysis
- Proficiency in SQL, Python, and Tableau
- Experience with Excel and data visualization
- Strong communication and problem-solving skills
- Bachelor's degree in a related field`

export default function DashboardPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [resumeText, setResumeText] = useState<string>("")
  const [jobDescription, setJobDescription] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const uploadRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!isAnalyzing) {
      setLoadingStep(0)
      setProgress(0)
      return
    }

    let currentStep = 0
    let elapsed = 0
    const totalDuration = LOADING_STEPS.reduce((acc, step) => acc + step.duration, 0)

    const interval = setInterval(() => {
      elapsed += 50
      setProgress(Math.min((elapsed / totalDuration) * 100, 95))

      let stepElapsed = 0
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        stepElapsed += LOADING_STEPS[i].duration
        if (elapsed < stepElapsed) {
          if (currentStep !== i) {
            currentStep = i
            setLoadingStep(i)
          }
          break
        }
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isAnalyzing])

  async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += pageText + "\n"
    }
    return fullText
  }

  const handleFileSelect = async (file: File) => {
    setError(null)

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.")
      return
    }

    setIsExtracting(true)
    setResumeFile(file)

    try {
      const text = await extractTextFromPDF(file)
      if (!text || text.trim().length < 50) {
        setError("Could not extract text from PDF. Please try a different file.")
        setResumeText("")
        return
      }

      setResumeText(text)
      setFileName(file.name)
      setResults(null)
      setAnalysis(null)
      setError(null)
    } catch (err) {
      setError("Failed to read PDF. Please try again.")
      setResumeText("")
      setResumeFile(null)
      setResults(null)
      setAnalysis(null)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleRemoveFile = () => {
    setResumeFile(null)
    setResumeText("")
    setResults(null)
    setAnalysis(null)
    setError(null)
  }

  const handleAnalyze = useCallback(async () => {
    if (!resumeText || resumeText.trim().length < 50) {
      setError("Please upload a valid resume with readable text.")
      return
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      setError("Please add a job description to analyze against.")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.detail || `Server error: ${response.status}`)
      }

      const data = await response.json()
      const analysisText = typeof data.analysis === "string" ? data.analysis : JSON.stringify(data.analysis, null, 2)
      setAnalysis(analysisText)
      setResults(null)

    } catch (err: any) {
      setError(`Analysis failed: ${err.message}. Make sure backend is running on port 8000.`)
      setResults(null)
      setAnalysis(null)
    } finally {
      setIsAnalyzing(false)
    }
  }, [resumeText, jobDescription])

  const handleReAnalyze = useCallback(async () => {
    if (!resumeText || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and add a job description first.",
        variant: "destructive",
      })
      return
    }

    setResults(null)
    setAnalysis(null)
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

    setTimeout(() => {
      handleAnalyze()
    }, 500)
  }, [resumeText, jobDescription, toast, handleAnalyze])

  const handleUseSampleJD = () => {
    setJobDescription(SAMPLE_JD)
  }

  const handleCopy = useCallback(async () => {
    if (!results) {
      toast({
        title: "No results available",
        description: "Run an analysis first to copy results.",
        variant: "destructive",
      })
      return
    }

    const formattedText = `RESUME ANALYSIS REPORT
========================

MATCH SCORE: ${results.matchScore}% (${results.matchLevel})
ATS Score: ${results.atsScore}%
Keyword Match: ${results.keywordMatch}%
Role Fit: ${results.roleFit}%

MATCHED SKILLS
--------------
${results.matchedSkills.map(s => `• ${s}`).join("\n")}

MISSING SKILLS
--------------
${results.skillGaps.map(s => `• ${s.skill} (${s.priority} priority)`).join("\n")}

AI SUGGESTIONS
--------------
${results.suggestions.map((s, i) => `${i + 1}. ${s.title}\n   ${s.description}`).join("\n\n")}

ATS KEYWORD OPPORTUNITIES
-------------------------
${results.atsKeywords.join(", ")}

RECRUITER IMPRESSION
--------------------
${results.recruiterImpression}

Generated by ResumeAI on ${new Date().toLocaleDateString()}
`

    try {
      await navigator.clipboard.writeText(formattedText)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "Analysis results copied successfully.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }, [results, toast])

  const handleExport = useCallback(async () => {
    if (!results) {
      toast({
        title: "No results available",
        description: "Run an analysis first to export results.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    const reportContent = `RESUME ANALYSIS REPORT
========================
Generated: ${new Date().toLocaleString()}

OVERALL SCORES
--------------
Match Score: ${results.matchScore}% (${results.matchLevel})
ATS Score: ${results.atsScore}%
Keyword Match: ${results.keywordMatch}%
Role Fit: ${results.roleFit}%

MATCHED SKILLS (${results.matchedSkills.length} found)
--------------
${results.matchedSkills.map(s => `  ✓ ${s}`).join("\n")}

MISSING SKILLS (${results.skillGaps.length} identified)
--------------
${results.skillGaps.map(s => `  ✗ ${s.skill} [${s.priority.toUpperCase()} PRIORITY]`).join("\n")}

AI-POWERED SUGGESTIONS
----------------------
${results.suggestions.map((s, i) => `
${i + 1}. ${s.title}
   ${s.description}
`).join("")}

SECTION-BY-SECTION REVIEW
-------------------------
${results.sectionFeedback.map(s => `
${s.section}: ${s.status.toUpperCase()}
  → ${s.note}
`).join("")}

ATS KEYWORD OPPORTUNITIES
-------------------------
Keywords to add: ${results.atsKeywords.join(", ")}

RECRUITER IMPRESSION
--------------------
"${results.recruiterImpression}"

---
This report was generated by ResumeAI
https://resumeai.app
`

    try {
      const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `resume-analysis-report-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: "Your analysis report has been downloaded.",
      })
    } catch {
      toast({
        title: "Export failed",
        description: "Unable to download the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [results, toast])

  const canAnalyze = Boolean(resumeText.trim() && jobDescription.trim().length > 0 && !isExtracting && !isAnalyzing)
  const LoadingIcon = LOADING_STEPS[loadingStep]?.icon || Sparkles

  return (
    <div className="min-h-screen bg-background dot-grid animate-fade-in">
      {/* Top Progress Bar */}
      {isAnalyzing && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-secondary overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent animate-progress-pulse transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                  <FileSearch className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">ResumeAI</span>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">Powered by AI</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-foreground gradient-text inline-block">Resume Analyzer</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Upload your resume and compare it against a job description with AI-powered insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6" ref={uploadRef}>
            {/* Resume Upload */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 transition-all hover:border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-semibold text-foreground">Upload Resume</h2>
                </div>
                {resumeFile && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                    Ready
                  </span>
                )}
              </div>
              
              {!resumeFile ? (
                <ResumeUploader onFileSelect={handleFileSelect} />
              ) : (
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{resumeFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="hover:bg-destructive/10 hover:text-destructive">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>Your file is processed securely</span>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 transition-all hover:border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <h2 className="font-semibold text-foreground">Job Description</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 text-muted-foreground hover:text-foreground"
                    onClick={handleUseSampleJD}
                  >
                    Use Sample
                  </Button>
                  {jobDescription && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setJobDescription("")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <Textarea
                placeholder="Paste the job description here to compare required skills, tools, and keywords..."
                className="min-h-[180px] resize-none bg-secondary/30 border-border focus:border-primary/50 rounded-xl"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
                  {jobDescription.length} characters
                </span>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Pro Tip</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    For best results, use an ATS-friendly resume and paste the complete job description including requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <div className="space-y-3">
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="w-full py-3 rounded-lg bg-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExtracting ? "Reading PDF..." : isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </button>
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
              <p className="text-xs text-center text-muted-foreground">
                AI will evaluate skills, keywords, and improvement opportunities
              </p>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-foreground">Analysis Results</h2>
              {results && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    disabled={!results}
                    className="text-muted-foreground hover:text-foreground h-8"
                  >
                    {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleExport}
                    disabled={!results || isExporting}
                    className="text-muted-foreground hover:text-foreground h-8"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-1" />
                    )}
                    {isExporting ? "Exporting..." : "Export"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReAnalyze}
                    disabled={isAnalyzing}
                    className="h-8"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4 mr-1" />
                    )}
                    {isAnalyzing ? "Analyzing..." : "Re-analyze"}
                  </Button>
                </div>
              )}
            </div>
            
            {isAnalyzing ? (
              <AnalysisSkeleton />
            ) : results ? (
              <AnalysisResults results={results} />
            ) : analysis ? (
              <div className="analysis-results p-4 bg-card/80 rounded-xl border border-border">
                <pre className="whitespace-pre-wrap text-sm text-foreground">{analysis}</pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                  <FileSearch className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-2">No Analysis Yet</p>
                <p className="text-muted-foreground text-sm max-w-xs mb-8">
                  Upload your resume and job description to see AI-powered analysis results
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["ATS Score", "Skill Match", "AI Suggestions"].map((chip) => (
                    <span key={chip} className="px-3 py-1.5 rounded-full bg-secondary/50 text-xs text-muted-foreground border border-border">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
