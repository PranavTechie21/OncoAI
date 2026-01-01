import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageCircle, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const supportOptions = [
  {
    title: "Email Support",
    description: "Get help via email",
    contact: "support@oncoai.com",
    responseTime: "24-48 hours",
    icon: Mail
  },
  {
    title: "Phone Support",
    description: "Speak with our team",
    contact: "+1 (555) 123-4567",
    responseTime: "Mon-Fri, 9AM-5PM EST",
    icon: Phone
  },
  {
    title: "Live Chat",
    description: "Chat with our support team",
    contact: "Available in-app",
    responseTime: "Real-time",
    icon: MessageCircle
  }
];

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-success/5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-border">
          <div className="container relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Support Center
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Need help? Reach out to our support team or consult our documentation.
              </p>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {supportOptions.map((option, idx) => (
                <Card key={idx} className="p-6 bg-card shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-300 border-border/50 dark:border-slate-700/50 text-center">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{option.title}</h3>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <p className="text-sm font-medium text-foreground mb-2">{option.contact}</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {option.responseTime}
                  </div>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card className="p-8 bg-card shadow-lg dark:shadow-xl border-border/50 dark:border-slate-700/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" className="dark:bg-slate-900/50 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" className="dark:bg-slate-900/50 dark:border-slate-700" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What can we help you with?" className="dark:bg-slate-900/50 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more about your question..." rows={6} className="dark:bg-slate-900/50 dark:border-slate-700" />
                </div>
                <Button type="submit" className="gap-2">
                  Send Message
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </Card>

            {/* Helpful Links */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 dark:from-primary/20 dark:via-primary/10 dark:to-success/20 border-primary/20 dark:border-primary/30">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Common Questions
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• How do I add a new patient?</li>
                  <li>• How are risk scores calculated?</li>
                  <li>• Can I export patient data?</li>
                  <li>• How do I schedule appointments?</li>
                </ul>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 dark:from-primary/20 dark:via-primary/10 dark:to-success/20 border-primary/20 dark:border-primary/30">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Resources
                </h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link to="/documentation">
                      <ArrowRight className="h-4 w-4" />
                      Documentation
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link to="/api-reference">
                      <ArrowRight className="h-4 w-4" />
                      API Reference
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link to="/research">
                      <ArrowRight className="h-4 w-4" />
                      Research Papers
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
