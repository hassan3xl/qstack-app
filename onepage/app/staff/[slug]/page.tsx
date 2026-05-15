import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { StaffMember } from "../../../components/StaffCard";
import {
  ArrowLeft,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Globe,
} from "lucide-react";
import { notFound } from "next/navigation";
import { backendUrl } from "../../../lib/services/apiService";

async function getStaffMember(slug: string): Promise<StaffMember | null> {
  try {
    const res = await fetch(`${backendUrl}/staff/${slug}/`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching staff member:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StaffDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const member = await getStaffMember(slug);

  if (!member) {
    notFound();
  }

  return (
    <div className="">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Back Button */}
        <Link href="/staff">
          <Button
            variant="ghost"
            className="mb-8 gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="size-4" />
            Back to Team
          </Button>
        </Link>

        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 md:p-12 mb-12">
          {/* Accent decorations */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-chart-2/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Large Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-chart-1 to-chart-2 blur-lg opacity-60 scale-110" />
              <Avatar className="relative size-40 md:size-48 ring-4 ring-background shadow-2xl">
                <AvatarImage src={member.avatar} alt={member.full_name} />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-chart-2 text-primary-foreground"></AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                {member.full_name}
              </h1>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
                {member.role.name}
              </span>

              {/* Social Links */}
              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-3 rounded-full bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110"
                  >
                    <Mail className="size-5" />
                  </a>
                )}
                {member.socials?.map((social, idx) => {
                  let Icon = Globe;
                  let hoverClass = "hover:bg-primary/10 hover:text-primary";

                  switch (social.platform) {
                    case "linkedin":
                      Icon = Linkedin;
                      hoverClass = "hover:bg-[#0077B5] hover:text-white";
                      break;
                    case "twitter":
                      Icon = Twitter;
                      hoverClass = "hover:bg-[#1DA1F2] hover:text-white";
                      break;
                    case "github":
                      Icon = Github;
                      hoverClass = "hover:bg-[#333] hover:text-white";
                      break;
                  }

                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-full bg-background/80 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110 ${hoverClass}`}
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Bio Section */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-6">About</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {member.bio}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border bg-card p-8 h-full">
              <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {member.skills?.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-chart-2/10 text-foreground border border-primary/20 hover:border-primary/40 transition-colors"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
