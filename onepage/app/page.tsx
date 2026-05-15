import { Hero } from "../components/hero";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { Code, Bot, Globe, ArrowRight } from "lucide-react";
import { BackendWarmer } from "../components/BackendWarmer";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <BackendWarmer />
      <Hero />

      {/* Services Highlight Section */}
      <section className="container mx-auto px-4 w-11/12 py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900 rounded-3xl">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
            Our Services
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            We provide end-to-end software solutions tailored to your business
            needs.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-12">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Globe className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Web Development</h3>
                <p className="text-sm text-muted-foreground">
                  Modern, responsive, and performant web applications.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Bot className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">AI Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  Cutting-edge AI agents, LLM integration, and automation.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Code className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Custom Software</h3>
                <p className="text-sm text-muted-foreground">
                  Tailor-made software to solve complex business challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <Link href="/services">
            <Button variant="outline" className="gap-2">
              View All Services <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust/About Highlight */}
      <section className="container mx-auto px-4 w-11/12 py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
            Why Choose Us?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            We combine technical expertise with a deep understanding of business
            goals to deliver results.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2 mt-12">
          <div className="p-6 border rounded-xl bg-card">
            <h3 className="font-bold text-xl mb-2">Expert Team</h3>
            <p className="text-muted-foreground">
              Skilled developers and engineers with years of experience.
            </p>
          </div>
          <div className="p-6 border rounded-xl bg-card">
            <h3 className="font-bold text-xl mb-2">Innovation Driven</h3>
            <p className="text-muted-foreground">
              We stay ahead of the curve with the latest technologies.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto w-11/12 py-12 md:py-24 lg:py-32 bg-primary/5 rounded-3xl mb-12">
        <div className="flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to start your project?
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Contact us today to discuss your requirements and how we can help
            you achieve your goals.
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Us</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
