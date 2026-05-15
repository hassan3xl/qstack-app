import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ArrowRight, Building2, Users, Zap, Heart } from "lucide-react";
import { backendUrl } from "../../lib/services/apiService";
import { JobCard, JobOpening } from "../../components/JobCard";

const perks = [
  {
    icon: Users,
    title: "Great Team",
    description: "Work with talented, passionate people who love what they do.",
  },
  {
    icon: Zap,
    title: "Growth Focused",
    description:
      "Continuous learning opportunities and career development paths.",
  },
  {
    icon: Building2,
    title: "Flexible Work",
    description: "Remote-friendly culture with flexible working hours.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description: "We believe in sustainable pace and mental well-being.",
  },
];

async function getJobOpenings(): Promise<JobOpening[]> {
  try {
    const res = await fetch(`${backendUrl}/jobs/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch job openings");
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export default async function CareersPage() {
  const jobOpenings = await getJobOpenings();

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
            Join Our Team
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Build the <span className="text-primary">Future</span> With Us
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We&apos;re always looking for talented individuals who share our
            passion for innovation and excellence. Join us in building software
            that matters.
          </p>
        </div>
      </section>

      {/* Perks Section */}
      <section className="container mx-auto px-4 w-11/12 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <perk.icon className="size-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{perk.title}</h3>
              <p className="text-muted-foreground text-sm">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Openings */}
      <section className="container mx-auto px-4 w-11/12 pb-20 md:pb-32">
        <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
        {jobOpenings.length > 0 ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No open positions at the moment.
            </p>
            <p className="text-muted-foreground">
              Check back soon or send us your resume!
            </p>
          </div>
        )}
      </section>

      {/* No Matching Role CTA */}
      <section className="container mx-auto w-11/12 py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl mb-12">
        <div className="flex flex-col items-center text-center gap-6 px-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Don&apos;t see a matching role?
          </h2>
          <p className="text-muted-foreground max-w-lg">
            We&apos;re always looking for exceptional talent. Send us your
            resume and tell us how you&apos;d like to contribute to our team.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="gap-2">
              Send Your Resume <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
