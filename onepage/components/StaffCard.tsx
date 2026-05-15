"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";
import { cn } from "../lib/utils";

export interface Role {
  id: string;
  name: string;
}

export interface Skils {
  id: string;
  name: string;
}
export interface Socials {
  platform: string;
  url: string;
}
export interface StaffMember {
  id: string;
  slug: string;
  full_name: string;
  role: Role;
  bio: string;
  avatar: string;
  email?: string;
  socials: Socials[];
  skills?: Skils[];
}

interface StaffCardProps {
  member: StaffMember;
  className?: string;
}

export function StaffCard({ member, className }: StaffCardProps) {
  const getIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="size-4" />;
      case "twitter":
        return <Twitter className="size-4" />;
      case "github":
        return <Github className="size-4" />;
      case "email":
        return <Mail className="size-4" />;
      default:
        return null;
    }
  };

  const getSocialStyle = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "hover:bg-[#0077B5] hover:text-white";
      case "twitter":
        return "hover:bg-[#1DA1F2] hover:text-white";
      case "github":
        return "hover:bg-[#333] hover:text-white";
      case "email":
        return "hover:bg-primary hover:text-primary-foreground";
      default:
        return "hover:bg-primary/10 hover:text-primary";
    }
  };

  return (
    <Link href={`/staff/${member.slug}`}>
      <Card
        className={cn(
          "group relative overflow-hidden p-0 border-0",
          "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
          "hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/5",
          "transition-all duration-500 ease-out",
          "hover:-translate-y-2 hover:scale-[1.02]",
          "cursor-pointer",
          className,
        )}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Glassmorphism accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-chart-2/10 rounded-full blur-3xl group-hover:bg-chart-2/20 transition-colors duration-500" />

        <div className="relative z-10 p-8 flex flex-col items-center text-center">
          {/* Avatar with ring effect */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-chart-1 to-chart-2 blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500 scale-110" />
            <Avatar className="relative size-28 ring-4 ring-background shadow-xl">
              <AvatarImage src={member.avatar} alt={member.full_name} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-chart-2 text-primary-foreground">
                {member.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name */}
          <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors duration-300">
            {member.full_name}
          </h3>

          {/* Role badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
            {member.role.name}
          </span>

          {/* Bio */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
            {member.bio}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {member.email && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `mailto:${member.email}`;
                }}
                className="p-2 rounded-full bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110"
              >
                <Mail className="size-4" />
              </span>
            )}
            {member.socials?.map((social, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(social.url, "_blank");
                }}
                className={cn(
                  "p-2 rounded-full bg-background/80 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110",
                  getSocialStyle(social.platform),
                )}
              >
                {getIcon(social.platform)}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-1 to-chart-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </Card>
    </Link>
  );
}
