import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import {
  ExternalLink,
  Github,
  Globe,
  Smartphone,
  Bot,
  ArrowRight,
} from "lucide-react";
import { backendUrl } from "../../lib/services/apiService";

interface Tag {
  id: string;
  name: string;
}
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: Tag[];
  category: "web" | "mobile" | "ai" | "enterprise";
  url?: string;
  githubUrl?: string;
  status: "live" | "development" | "managing";
  client?: string;
  is_pinned?: boolean;
}

const statusColors = {
  live: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  development:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  managing:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

const statusLabels = {
  live: "Live",
  development: "In Development",
  managing: "Managing",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {/* Gradient overlay */}
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}
        >
          {statusLabels[project.status]}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        {project.client && (
          <p className="text-sm text-muted-foreground mb-2">
            Client: {project.client}
          </p>
        )}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project?.tags?.slice(0, 5).map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 rounded-md text-xs font-medium bg-primary/5 text-primary"
            >
              {tag.name}
            </span>
          ))}
          {project.tags?.length > 5 && (
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
              +{project.tags.length - 5}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="size-4" />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
            >
              <Github className="size-4" />
              Code
            </a>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-1 to-chart-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

async function portfolio(): Promise<Project[]> {
  try {
    const res = await fetch(`${backendUrl}/portfolio/`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error("Failed to fetch staff members");
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await portfolio();
  const pinnedProjects = projects.filter((p) => p.is_pinned);
  const otherProjects = projects.filter((p) => !p.is_pinned);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 w-11/12 text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
            Our Work
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Projects We&apos;ve <span className="text-primary">Built</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            From innovative startups to enterprise solutions, here are some of
            the projects we&apos;re proud to have built and continue to manage.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      {/* Pinned Projects Section */}
      {pinnedProjects.length > 0 && (
        <section className="container mx-auto px-4 w-11/12 pb-12">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Featured Projects
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pinnedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* All Projects Grid */}
      <section className="container mx-auto px-4 w-11/12 pb-20 md:pb-32">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">All Projects</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto w-11/12 py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl mb-12">
        <div className="flex flex-col items-center text-center gap-6 px-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Have a project in mind?
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Let&apos;s discuss how we can bring your ideas to life. We&apos;re
            always excited to take on new challenges.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              Start a Project <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
