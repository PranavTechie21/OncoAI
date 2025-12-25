import { Brain, Dna, HeartPulse } from "lucide-react";
import { AddPatientDialog } from "./AddPatientDialog";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero py-12 lg:py-16 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 dark:bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Personalized Cancer
                <br />
                <span className="text-gradient bg-gradient-to-r from-primary via-primary to-primary/80 dark:from-primary dark:via-primary dark:to-primary/90">Treatment Planning</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed">
                AI-driven tailored treatment recommendations for each patient.
                Analyze clinical data, predict outcomes, and optimize protocols.
              </p>
            </div>

            <div>
              <AddPatientDialog />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">AI-Powered</p>
                  <p className="text-xs text-muted-foreground">Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Dna className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Genomic</p>
                  <p className="text-xs text-muted-foreground">Integration</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Real-time</p>
                  <p className="text-xs text-muted-foreground">Monitoring</p>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden lg:flex justify-center animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-2xl rotate-12 animate-float" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-success/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
              
              <div className="relative z-10 bg-card dark:bg-slate-800/50 rounded-3xl shadow-card dark:shadow-xl p-8 border border-border/50 dark:border-slate-700/50">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    {/* Central brain icon */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center">
                      <Brain className="w-16 h-16 text-primary animate-pulse-soft" />
                    </div>
                    
                    {/* Orbiting elements */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-success dark:bg-success/80 rounded-full flex items-center justify-center shadow-lg dark:shadow-xl">
                      <Dna className="w-4 h-4 text-success-foreground" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-primary dark:bg-primary/80 rounded-full flex items-center justify-center shadow-lg dark:shadow-xl">
                      <HeartPulse className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="h-2 bg-muted dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary dark:bg-primary/80 rounded-full" />
                  </div>
                  <div className="h-2 bg-muted dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-success dark:bg-success/80 rounded-full" />
                  </div>
                  <div className="h-2 bg-muted dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-warning dark:bg-warning/80 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
