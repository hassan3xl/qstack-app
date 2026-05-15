"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const routes = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/staff", label: "Team" },
    { href: "/careers", label: "Careers" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center w-11/12 mx-auto">
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetTitle />
            <div className="my-4 flex flex-col space-y-3 pb-10 pl-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search or other items here */}
          </div>
          <nav className="flex items-center">
            <Link href="/contact">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
