import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar,
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const papers = [
  {
    title: "Artificial Intelligence in Cancer Pathology: Applications, Challenges, and Future Directions",
    authors: "Wang J, Wang T, Han R, Shi D, Chen B",
    date: "2025",
    journal: "CytoJournal",
    description: "AI has transformative potential in cancer pathology, enhancing diagnostic accuracy through deep learning and computer vision for tissue classification, mutation detection, and prognostic predictions across breast, lung, prostate, and colorectal cancers.",
    tags: ["AI", "Pathology", "Deep Learning", "Diagnostics"],
    type: "Research Article",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12134795/",
    impact: "High",
    citations: "New"
  },
  {
    title: "Exploring the Role of AI in Chemotherapy Development, Cancer Diagnosis, and Treatment",
    authors: "Abdul Rasool Hassan B, Mohammed AH, Hallit S, Malaeb D, Hosseini H",
    date: "2025",
    journal: "Frontiers in Oncology",
    description: "Comprehensive review of AI applications in oncology showing ML and DL's promising role in chemotherapy development, cancer diagnosis, and predicting treatment response through imaging, genomic, and clinical data integration.",
    tags: ["Chemotherapy", "Machine Learning", "Treatment Response", "Precision Medicine"],
    type: "Review",
    url: "https://www.frontiersin.org/journals/oncology/articles/10.3389/fonc.2025.1475893/full",
    impact: "High",
    citations: "New"
  },
  {
    title: "Artificial Intelligence in Cancer: Applications, Challenges, and Future Perspectives",
    authors: "Cheng CH, Shi SS",
    date: "2025",
    journal: "Molecular Cancer",
    description: "AI is revolutionizing oncological research through advanced algorithms, specialized computing hardware, and large cancer datasets. AI-driven computer-aided diagnosis systems achieve 90% accuracy in distinguishing benign from malignant lesions.",
    tags: ["Computer Vision", "Clinical AI", "Cancer Research", "CAD Systems"],
    type: "Research Article",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12574039/",
    impact: "Very High",
    citations: "28"
  },
  {
    title: "Current AI Technologies in Cancer Diagnostics and Treatment",
    authors: "Ma Y, et al.",
    date: "2025",
    journal: "Molecular Cancer",
    description: "Introduction of HistoPathExplorer and CHIEF framework demonstrating AI's capability in cancer diagnosis with AUROC of 0.9397 across 11 cancer types. Multi-omics integration with deep learning improves early detection and prognosis.",
    tags: ["Digital Pathology", "Multi-omics", "Biomarkers", "Deep Learning"],
    type: "Research Article",
    url: "https://link.springer.com/article/10.1186/s12943-025-02369-9",
    impact: "Very High",
    citations: "45"
  },
  {
    title: "Agentic AI: The Future of Cancer Detection and Diagnosis",
    authors: "Multiple Authors",
    date: "2024-2025",
    journal: "ScienceDirect",
    description: "Large Language Models and Vision-Language Models show performance similar to human experts. GPT-4 detected errors better than pathologists (89.5% vs 88.5%) and staged ovarian cancer with 97% accuracy compared to 88% by radiologists.",
    tags: ["LLMs", "VLMs", "GPT-4", "Cancer Detection"],
    type: "Systematic Review",
    url: "https://www.sciencedirect.com/science/article/pii/S2590005625003030",
    impact: "High",
    citations: "12"
  },
  {
    title: "AI Detects Cancer But Also Extracts Demographic Information",
    authors: "Harvard Medical School Research Team",
    date: "2025",
    journal: "Harvard Medical School",
    description: "Research reveals AI systems can infer patient demographics from pathology slides, leading to biased results. Study demonstrates methods to significantly reduce these disparities, emphasizing need for fairness evaluation in medical AI.",
    tags: ["Bias Detection", "Healthcare Equity", "AI Ethics", "Fairness"],
    type: "Research Study",
    url: "https://www.sciencedaily.com/releases/2025/12/251217231230.htm",
    impact: "High",
    citations: "8"
  },
  {
    title: "DeepHeme: AI Tool for Automated Blood Cancer Diagnosis",
    authors: "MSK, UCSF, UC Berkeley Researchers",
    date: "2025",
    journal: "Science Translational Medicine",
    description: "DeepHeme automates blood and bone marrow cancer diagnosis with expert-level accuracy, reducing diagnosis time from 30+ minutes to seconds through AI-powered cell counting and classification.",
    tags: ["Blood Cancer", "Automation", "Clinical AI", "Hematology"],
    type: "Research Article",
    url: "https://www.mskcc.org/news/top-cancer-research-advances-at-msk-in-2025",
    impact: "Very High",
    citations: "22"
  },
  {
    title: "Sybil: AI Model Predicts Lung Cancer Risk Up to 6 Years in Advance",
    authors: "MIT Research Team",
    date: "2024",
    journal: "MIT Research",
    description: "AI learning model predicts lung cancer likelihood up to six years in advance using low-dose CT scans. Trained on complex imaging data, Sybil forecasts both short- and long-term lung cancer risk with high accuracy.",
    tags: ["Lung Cancer", "Early Detection", "Predictive AI", "Imaging"],
    type: "Research Study",
    url: "https://www.weforum.org/stories/2025/02/cancer-treatment-and-diagnosis-breakthroughs/",
    impact: "Very High",
    citations: "67"
  }
];

const categories = ["All", "AI", "Machine Learning", "Deep Learning", "Diagnostics", "Treatment", "Genomics"];
const impactLevels = ["All Impact", "Very High", "High", "Medium"];

export default function ResearchPapers() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImpact, setSelectedImpact] = useState("All Impact");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPapers = papers.filter(paper => {
    const matchesCategory = selectedCategory === "All" || 
      paper.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesImpact = selectedImpact === "All Impact" || paper.impact === selectedImpact;
    const matchesSearch = searchQuery === "" || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesImpact && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-background to-success/10">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
                <Sparkles className="h-3 w-3 mr-1" />
                Latest Research 2025-2026
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Cutting-Edge Cancer
                <span className="text-gradient"> Research</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Explore the latest peer-reviewed publications in AI-driven oncology, personalized medicine, 
                and breakthrough cancer diagnostic technologies from leading research institutions worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Submit Research
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Award className="h-4 w-4" />
                  Collaborate With Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30 border-b border-border/50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 bg-card shadow-card border-border/50 text-center">
                <div className="text-4xl font-bold text-primary mb-2">{papers.length}+</div>
                <div className="text-sm text-muted-foreground">Research Papers</div>
              </Card>
              <Card className="p-6 bg-card shadow-card border-border/50 text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Citations</div>
              </Card>
              <Card className="p-6 bg-card shadow-card border-border/50 text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Research Partners</div>
              </Card>
              <Card className="p-6 bg-card shadow-card border-border/50 text-center">
                <div className="text-4xl font-bold text-primary mb-2">2025</div>
                <div className="text-sm text-muted-foreground">Latest Publications</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-background/80 sticky top-16 z-10 border-b border-border/50 backdrop-blur-sm">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search papers by title, author, or keywords..."
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="pl-10 pr-8 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <select
                  className="px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                  value={selectedImpact}
                  onChange={(e) => setSelectedImpact(e.target.value)}
                >
                  {impactLevels.map(impact => (
                    <option key={impact} value={impact}>{impact}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredPapers.length} of {papers.length} research papers
            </div>
          </div>
        </section>

        {/* Papers List */}
        <section className="py-16">
          <div className="container">
            <div className="space-y-6">
              {filteredPapers.map((paper, idx) => (
                <Card 
                  key={idx} 
                  className="p-8 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50 group"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={`${
                              paper.impact === 'Very High' 
                                ? 'bg-success/10 text-success border-success/20' 
                                : 'bg-primary/10 text-primary border-primary/20'
                            }`}>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {paper.impact} Impact
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {paper.type}
                            </Badge>
                            {paper.citations === "New" ? (
                              <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                New
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                {paper.citations} Citations
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {paper.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{paper.authors}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{paper.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              <span className="font-medium">{paper.journal}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {paper.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {paper.tags.map((tag, tagIdx) => (
                              <Badge 
                                key={tagIdx} 
                                variant="outline" 
                                className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => window.open(paper.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Read Full Paper
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => window.open(paper.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Award className="h-4 w-4" />
                          Cite Paper
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Topics Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Trending Topics
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Research Focus Areas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore the most active research domains in AI-powered oncology
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "AI Diagnostics", count: 28, icon: Sparkles },
                { title: "Deep Learning", count: 22, icon: TrendingUp },
                { title: "Precision Medicine", count: 18, icon: Award },
                { title: "Clinical AI", count: 15, icon: Users }
              ].map((topic, idx) => (
                <Card 
                  key={idx} 
                  className="p-6 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50 text-center group cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <topic.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{topic.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">{topic.count}</p>
                  <p className="text-sm text-muted-foreground">Active Papers</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <Card className="p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 border-primary/20 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Contribute to Our Research
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Are you conducting research in AI-powered oncology? We welcome collaborations 
                and submissions from researchers worldwide. Join us in advancing cancer care through innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Award className="h-4 w-4" />
                  Submit Your Research
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Users className="h-4 w-4" />
                  Join Research Network
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}