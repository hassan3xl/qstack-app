"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  MapPin,
  Clock,
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Building2,
  Send,
  X,
} from "lucide-react";

interface Responsibility {
  description: string;
}

interface Requirement {
  description: string;
}

interface Benefit {
  description: string;
}

interface SalaryRange {
  min_salary: string;
  max_salary: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  company: string;
  site: "onsite" | "remote" | "hybrid";
  job_type: "full-time" | "part-time" | "contract" | "internship";
  experience: string;
  description: string;
  responsibilities: Responsibility[];
  requirements: Requirement[];
  benefits: Benefit[];
  salary_range?: SalaryRange;
  posted_at: string;
  updated_at: string;
}

interface JobCardProps {
  job: JobOpening;
}

const typeColors: Record<string, string> = {
  "full-time":
    "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  "part-time":
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  contract:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  internship:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

const siteLabels: Record<string, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

export function JobCard({ job }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formatSalary = (salaryRange?: SalaryRange) => {
    if (!salaryRange) return null;
    const min = parseFloat(salaryRange.min_salary).toLocaleString();
    const max = parseFloat(salaryRange.max_salary).toLocaleString();
    return `₦${min} - ₦${max}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setShowForm(false);
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
        isExpanded
          ? "shadow-xl border-primary/30"
          : "hover:shadow-lg hover:border-primary/20"
      }`}
    >
      {/* Main Card Content - Clickable Header */}
      <div
        className="p-6 md:p-8 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left side - Job info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  typeColors[job.job_type] || typeColors["full-time"]
                }`}
              >
                {job.job_type
                  ?.replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {siteLabels[job.site] || job.site}
              </span>
              <span className="text-xs text-muted-foreground">
                {job.department}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p
              className={`text-muted-foreground mb-4 ${isExpanded ? "" : "line-clamp-2"}`}
            >
              {job.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="size-4" />
                {job.experience}
              </span>
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-4" />
                {job.company}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" />
                Posted{" "}
                {new Date(job.posted_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {job.salary_range && (
              <p className="mt-3 text-sm font-medium text-primary">
                {formatSalary(job.salary_range)}
              </p>
            )}
          </div>

          {/* Right side - Expand indicator */}
          <div className="flex items-center md:self-center">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <>
                  Less <ChevronUp className="size-4" />
                </>
              ) : (
                <>
                  View Details <ChevronDown className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 md:px-8 pb-6 md:pb-8 border-t pt-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3">Responsibilities</h4>
              <ul className="space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <CheckCircle2 className="size-4 text-primary mt-1 flex-shrink-0" />
                    <span>{item.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3">Requirements</h4>
              <ul className="space-y-2">
                {job.requirements.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <CheckCircle2 className="size-4 text-chart-2 mt-1 flex-shrink-0" />
                    <span>{item.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3">Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {item.description}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button / Form Toggle */}
          <div className="pt-4 border-t">
            {!showForm ? (
              <Button
                size="lg"
                className="w-full md:w-auto gap-2"
                onClick={() => setShowForm(true)}
              >
                Apply for this Position
                <Send className="size-4" />
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">
                    Apply for {job.title}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                {isSubmitted ? (
                  <div className="p-6 rounded-xl bg-green-500/10 text-center">
                    <CheckCircle2 className="size-12 text-green-500 mx-auto mb-3" />
                    <h5 className="font-semibold text-lg mb-1">
                      Application Submitted!
                    </h5>
                    <p className="text-muted-foreground">
                      Thank you for your interest. We&apos;ll be in touch soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          placeholder="+234 800 000 0000"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          LinkedIn Profile
                        </label>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/johndoe"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Portfolio / Resume URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://yourportfolio.com or Google Drive link"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Cover Letter / Why you&apos;re a great fit *
                      </label>
                      <Textarea
                        placeholder="Tell us about your experience and why you're interested in this role..."
                        rows={4}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-1 to-chart-2 transition-transform duration-500 ${
          isExpanded ? "scale-x-100" : "scale-x-0"
        } origin-left`}
      />
    </div>
  );
}
