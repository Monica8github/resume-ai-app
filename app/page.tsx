import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileSearch, Target, Lightbulb, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileSearch className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground">ResumeAI</span>
            </div>
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[96px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Land your dream job with{" "}
              <span className="text-primary">AI-powered</span> resume analysis.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Upload your resume and job description to get instant insights. Discover skill gaps, 
              match scores, and actionable suggestions to stand out from the competition.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Analyze My Resume
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">How ResumeAI Works</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Three simple steps to optimize your resume for any position
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileSearch className="w-6 h-6" />}
              title="Upload Resume"
              description="Upload your resume as a PDF and paste the job description you&apos;re targeting."
            />
            <FeatureCard 
              icon={<Target className="w-6 h-6" />}
              title="AI Analysis"
              description="Our AI analyzes your resume against the job requirements and calculates a match score."
            />
            <FeatureCard 
              icon={<Lightbulb className="w-6 h-6" />}
              title="Get Insights"
              description="Receive detailed skill gap analysis and personalized improvement suggestions."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-card/50 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground text-balance">
                Stop guessing. Start landing interviews.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Most resumes get rejected in seconds. Our AI helps you understand exactly 
                what hiring managers are looking for and how to position yourself as the ideal candidate.
              </p>
              <ul className="mt-8 space-y-4">
                <BenefitItem text="Instant match score against any job description" />
                <BenefitItem text="Identify missing skills and keywords" />
                <BenefitItem text="Actionable suggestions to improve your resume" />
                <BenefitItem text="Beat Applicant Tracking Systems (ATS)" />
              </ul>
            </div>
            <div className="relative">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">85%</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Match Score</p>
                    <p className="text-sm text-muted-foreground">Strong candidate fit</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-destructive/20 text-destructive text-xs rounded-full">Missing</div>
                    <span className="text-sm text-foreground">Docker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-destructive/20 text-destructive text-xs rounded-full">Missing</div>
                    <span className="text-sm text-foreground">Kubernetes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Match</div>
                    <span className="text-sm text-foreground">React</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to optimize your resume?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Join thousands of job seekers who have improved their resumes with ResumeAI.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button size="lg" className="gap-2">
              Start Free Analysis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <FileSearch className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">ResumeAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with AI to help you land your dream job.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
      <span className="text-foreground">{text}</span>
    </li>
  )
}
