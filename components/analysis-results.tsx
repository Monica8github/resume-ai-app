"use client"

import { CheckCircle2, AlertCircle, Lightbulb, Target, FileText, Sparkles, TrendingUp, Info } from "lucide-react"
import { CircularScore } from "@/components/circular-score"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { AnalysisResult } from "@/app/dashboard/page"

interface AnalysisResultsProps {
  results: AnalysisResult
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const { 
    matchScore, 
    matchLevel, 
    atsScore,
    keywordMatch,
    roleFit,
    skillGaps, 
    matchedSkills, 
    suggestions,
    sectionFeedback,
    atsKeywords,
    recruiterImpression
  } = results

  const getStatusColor = (status: string) => {
    switch (status) {
      case "strong": return "bg-primary/20 text-primary border-primary/30"
      case "good": return "bg-accent/20 text-accent border-accent/30"
      case "needs-work": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default: return "bg-secondary text-muted-foreground border-border"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "strong": return "Strong"
      case "good": return "Good"
      case "needs-work": return "Needs Work"
      default: return status
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-240px)] pr-2 -mr-2">
        {/* Top Score Summary */}
        <div className="animate-slide-up">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <CircularScore score={matchScore} size={120} />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-foreground mb-1">Resume Match Score</h3>
                <p className={`text-sm font-medium mb-4 ${
                  matchScore >= 80 ? "text-primary" : 
                  matchScore >= 60 ? "text-accent" : "text-amber-400"
                }`}>
                  {matchLevel}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-2 rounded-lg bg-background/50 border border-border text-center cursor-help">
                        <p className="text-lg font-bold text-foreground">{atsScore}%</p>
                        <p className="text-[10px] text-muted-foreground">ATS Score</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[200px]">
                      <p className="text-xs">How well your resume will perform with Applicant Tracking Systems</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="p-2 rounded-lg bg-background/50 border border-border text-center">
                    <p className="text-lg font-bold text-foreground">{keywordMatch}%</p>
                    <p className="text-[10px] text-muted-foreground">Keywords</p>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50 border border-border text-center">
                    <p className="text-lg font-bold text-foreground">{roleFit}%</p>
                    <p className="text-[10px] text-muted-foreground">Role Fit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <div className="animate-slide-up-delay-1">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground text-sm">Matched Skills</h3>
                <span className="text-xs text-muted-foreground ml-auto">{matchedSkills.length} found</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/15 text-primary border border-primary/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skill Gaps */}
        {skillGaps.length > 0 && (
          <div className="animate-slide-up-delay-2">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                </div>
                <h3 className="font-medium text-foreground text-sm">Missing Skills</h3>
                <span className="text-xs text-muted-foreground ml-auto">Suggested to add</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillGaps.map((gap, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <span
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-medium cursor-help transition-all hover:scale-105
                          ${gap.priority === "high" 
                            ? "bg-destructive/15 text-destructive border border-destructive/20" 
                            : gap.priority === "medium"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                            : "bg-muted text-muted-foreground border border-border"
                          }
                        `}
                      >
                        {gap.skill}
                        {gap.priority === "high" && <span className="ml-1">!</span>}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-card border-border">
                      <p className="text-xs">Add this skill to your resume</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        <div className="animate-slide-up-delay-3">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-accent" />
              </div>
              <h3 className="font-medium text-foreground text-sm">AI Suggestions</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-secondary/30 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <p className="font-medium text-foreground text-sm flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 text-xs">
                      {index + 1}
                    </span>
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 ml-7 leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section-by-Section Review */}
        <div className="animate-slide-up-delay-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm">Section Review</h3>
            </div>
            <div className="space-y-2">
              {sectionFeedback.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2.5 bg-secondary/30 rounded-lg"
                >
                  <span className="font-medium text-foreground text-sm w-24 flex-shrink-0">{item.section}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ATS Keywords */}
        <div className="animate-slide-up-delay-5">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-accent" />
              </div>
              <h3 className="font-medium text-foreground text-sm">ATS Keyword Opportunities</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {atsKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="w-3 h-3" />
              Incorporate these keywords naturally into your resume
            </p>
          </div>
        </div>

        {/* Recruiter Impression */}
        <div className="animate-slide-up-delay-5">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm">Recruiter Impression</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              &quot;{recruiterImpression}&quot;
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
