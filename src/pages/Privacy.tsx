import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const privacySections = [
  {
    title: "Data Collection",
    icon: FileText,
    content: "We collect only the necessary information required to provide our services, including patient data, treatment records, and clinical information. All data is collected with explicit consent and in compliance with HIPAA regulations."
  },
  {
    title: "Data Security",
    icon: Lock,
    content: "We employ industry-standard encryption, secure data storage, and regular security audits to protect your information. All data transmissions are encrypted using TLS 1.3, and we maintain SOC 2 Type II certification."
  },
  {
    title: "Data Usage",
    icon: Eye,
    content: "Your data is used solely for providing personalized treatment recommendations and improving our AI models. We never sell or share patient data with third parties. Data is anonymized when used for research purposes."
  },
  {
    title: "Your Rights",
    icon: Shield,
    content: "You have the right to access, modify, or delete your data at any time. You can request data exports, opt out of certain data processing, and file complaints. Contact us at privacy@oncoai.com for any privacy-related requests."
  }
];

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-success/5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-border">
          <div className="container relative">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Last updated: January 2024
              </p>
              <p className="text-muted-foreground">
                We respect your privacy. This page outlines how we collect, use, and protect your data.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="space-y-8">
              {privacySections.map((section, idx) => (
                <Card key={idx} className="p-8 bg-card shadow-lg dark:shadow-xl border-border/50 dark:border-slate-700/50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed ml-16">
                    {section.content}
                  </p>
                </Card>
              ))}

              {/* Compliance */}
              <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 dark:from-primary/20 dark:via-primary/10 dark:to-success/20 border-primary/20 dark:border-primary/30">
                <h2 className="text-2xl font-bold text-foreground mb-4">Compliance</h2>
                <p className="text-muted-foreground mb-4">
                  OncoAI is fully compliant with:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• HIPAA (Health Insurance Portability and Accountability Act)</li>
                  <li>• GDPR (General Data Protection Regulation)</li>
                  <li>• SOC 2 Type II</li>
                  <li>• ISO 27001</li>
                </ul>
              </Card>

              {/* Contact */}
              <Card className="p-8 bg-card shadow-lg dark:shadow-xl border-border/50 dark:border-slate-700/50">
                <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@oncoai.com" className="text-primary hover:underline">
                    privacy@oncoai.com
                  </a>
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
