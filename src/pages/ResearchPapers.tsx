import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Calendar } from "lucide-react";

const papers = [
  {
    title: "Improving Treatment Outcomes with AI-Driven Personalized Oncology",
    authors: "Dr. Sarah Chen, Dr. Michael Rodriguez",
    date: "2024",
    journal: "Journal of Clinical Oncology",
    description: "A comprehensive study on the impact of AI-powered treatment recommendations on patient outcomes.",
    tags: ["AI", "Personalized Medicine", "Oncology"]
  },
  {
    title: "Tumor Genomics and Personalized Therapy: A Machine Learning Approach",
    authors: "Dr. Emily Watson, Dr. James Park",
    date: "2024",
    journal: "Nature Medicine",
    description: "Exploring genomic markers and their correlation with treatment response using advanced ML models.",
    tags: ["Genomics", "Machine Learning", "Therapy"]
  },
  {
    title: "Risk Assessment Models for Cancer Treatment Planning",
    authors: "OncoAI Research Team",
    date: "2023",
    journal: "Cancer Research",
    description: "Development and validation of risk scoring algorithms for personalized treatment protocols.",
    tags: ["Risk Assessment", "Treatment Planning", "Algorithms"]
  },
  {
    title: "Real-time Monitoring of Cancer Treatment Response",
    authors: "Dr. Alan Rivera, Dr. Lisa Wong",
    date: "2023",
    journal: "The Lancet Oncology",
    description: "Implementation of real-time monitoring systems for tracking treatment efficacy and patient progress.",
    tags: ["Monitoring", "Treatment Response", "Real-time"]
  }
];

export default function ResearchPapers() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-success/5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-border">
          <div className="container relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Research Papers
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Curated research and publications related to personalized oncology and AI-driven treatment planning.
              </p>
            </div>
          </div>
        </section>

        {/* Papers List */}
        <section className="py-16">
          <div className="container">
            <div className="space-y-6">
              {papers.map((paper, idx) => (
                <Card key={idx} className="p-8 bg-card shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 border-border/50 dark:border-slate-700/50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {paper.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {paper.date}
                        </span>
                        <span>{paper.journal}</span>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {paper.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.tags.map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Read Online
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
