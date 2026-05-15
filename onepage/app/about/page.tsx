import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32 w-11/12 mx-auto">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            About Quantum Stack
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Quantum Stack Technologies LTD is a forward-thinking software
            building company. We serve as a parent company fostering innovation
            across multiple domains, including Web Development, Artificial
            Intelligence, and Cloud Computing.
          </p>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our mission is to bridge the gap between complex technology and
            business needs. We believe in building software that is not only
            functional but also intuitive, scalable, and beautiful.
          </p>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted/50 flex items-center justify-center">
          {/* Placeholder for an image or graphic */}
          <span className="text-muted-foreground">
            <Image
              src="/full-logo.png"
              alt="Quantum Stack"
              width={500}
              height={500}
            />
          </span>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="p-6 border rounded-xl">
            <h3 className="font-bold text-xl mb-2">Innovation</h3>
            <p className="text-muted-foreground">
              Always exploring new technologies and methodologies.
            </p>
          </div>
          <div className="p-6 border rounded-xl">
            <h3 className="font-bold text-xl mb-2">Quality</h3>
            <p className="text-muted-foreground">
              Commitment to excellence in code, design, and performance.
            </p>
          </div>
          <div className="p-6 border rounded-xl">
            <h3 className="font-bold text-xl mb-2">Integrity</h3>
            <p className="text-muted-foreground">
              Transparent communication and reliable delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Whether you are a startup looking for an MVP or an enterprise needing
          digital transformation, we are here to help.
        </p>
        <Link href="/contact">
          <Button size="lg" className="gap-2">
            Contact Us <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
