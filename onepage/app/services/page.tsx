import { Button } from "../../components/ui/button";
import {
  ArrowRight,
  Bot,
  Code,
  Database,
  Smartphone,
  Cloud,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      title: "Web Development",
      description:
        "High-performance, responsive, and SEO-optimized web applications using Next.js and React.",
      icon: <Code className="h-10 w-10 text-primary" />,
    },
    {
      title: "AI & Machine Learning",
      description:
        "Custom AI agents, LLM integration, and predictive analytics to automate your business.",
      icon: <Bot className="h-10 w-10 text-primary" />,
    },
    {
      title: "Mobile App Development",
      description:
        "Native and cross-platform mobile apps that provide seamless user experiences.",
      icon: <Smartphone className="h-10 w-10 text-primary" />,
    },
    {
      title: "Cloud Infrastructure",
      description:
        "Scalable cloud architecture, DevOps, and deployment strategies on AWS, Azure, or GCP.",
      icon: <Cloud className="h-10 w-10 text-primary" />,
    },
    {
      title: "Software Architecture",
      description:
        "Robust and scalable system designs that grow with your business needs.",
      icon: <Database className="h-10 w-10 text-primary" />,
    },
    {
      title: "Cybersecurity",
      description:
        "Protecting your data and systems with advanced security protocols and audits.",
      icon: <Shield className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div className="container py-12 md:py-24 lg:py-32 w-11/12 mx-auto">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Our Services
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          We offer a comprehensive suite of software solutions to propel your
          business forward.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-xl border p-8 hover:bg-muted/50 transition-colors"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold">{service.title}</h3>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 flex justify-center">
        <Link href="/contact">
          <Button size="lg" className="gap-2">
            Get a Quote <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
