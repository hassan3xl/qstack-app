"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Sparkles } from "lucide-react";

import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/services"
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Transforming Ideas into Reality
          </Link>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          Building the Future with{" "}
          <span className="text-primary">Quantum Stack</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
        >
          We are a premier software building company specializing in Web
          Development, AI Solutions, and Scalable Architectures. Your vision,
          our technology.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-x-4"
        >
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
