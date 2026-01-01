import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { FileText, Scale, AlertCircle, CheckCircle2 } from "lucide-react";

const termsSections = [
  {
    title: "Acceptance of Terms",
    icon: CheckCircle2,
    content: "By accessing and using OncoAI, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services."
  },
  {
    title: "Use of Service",
    icon: FileText,
    content: "OncoAI is intended for healthcare professionals and medical institutions. You agree to use the service only for lawful purposes and in accordance with applicable medical regulations and standards."
  },
  {
    title: "Medical Disclaimer",
    icon: AlertCircle,
    content: "OncoAI provides AI-powered recommendations and should be used as a decision support tool. All treatment decisions must be made by qualified healthcare professionals. We are not liable for any medical decisions made based on our recommendations."
  },
  {
    title: "Intellectual Property",
    icon: Scale,
    content: "All content, features, and functionality of OncoAI are owned by us and protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission."
  }
];

export default function Terms() {
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
                  <Scale className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Last updated: January 2024
              </p>
              <p className="text-muted-foreground">
                These terms govern your use of OncoAI services. Please read them carefully.
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="space-y-8">
              {termsSections.map((section, idx) => (
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

              {/* Additional Terms */}
              <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 dark:from-primary/20 dark:via-primary/10 dark:to-success/20 border-primary/20 dark:border-primary/30">
                <h2 className="text-2xl font-bold text-foreground mb-4">Additional Terms</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• <strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>• <strong>Data Accuracy:</strong> You agree to provide accurate and complete information when using our services.</li>
                  <li>• <strong>Service Modifications:</strong> We reserve the right to modify or discontinue services at any time.</li>
                  <li>• <strong>Limitation of Liability:</strong> Our liability is limited to the maximum extent permitted by law.</li>
                  <li>• <strong>Termination:</strong> We may terminate or suspend your access for violation of these terms.</li>
                </ul>
              </Card>

              {/* Contact */}
              <Card className="p-8 bg-card shadow-lg dark:shadow-xl border-border/50 dark:border-slate-700/50">
                <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us at{" "}
                  <a href="mailto:legal@oncoai.com" className="text-primary hover:underline">
                    legal@oncoai.com
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
