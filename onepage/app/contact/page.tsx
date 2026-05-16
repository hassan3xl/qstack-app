import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import SendMessageForm from "../../components/SendMessageForm";

export const metadata: Metadata = {
  title: "Contact Us | Quantum Stack Technologies",
  description:
    "Get in touch with Quantum Stack Technologies for your software, AI, and web development needs.",
};

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32 w-11/12 mx-auto">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Get in Touch
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Have a project in mind? Let&apos;s talk about how we can work
          together.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold text-lg">Email us</h3>
              <p className="text-muted-foreground">info@qstack.io</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold text-lg">Call us</h3>
              <p className="text-muted-foreground">+234 000 000-0000</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold text-lg">Visit us</h3>
              <p className="text-muted-foreground">
                Quantum Stack Headquarters
                <br />
                Innovation District, Tech City
              </p>
            </div>
          </div>
        </div>

        <SendMessageForm source="quantum-stack" />
      </div>
    </div>
  );
}
