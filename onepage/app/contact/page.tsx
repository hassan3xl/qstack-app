"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Mail,
  MapPin,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { backendUrl } from "../../lib/services/apiService";
import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch(`${backendUrl}/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      reset();

      // Reset status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

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

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll get back to you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">
                  Thanks for reaching out. We will get back to you soon.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setStatus("idle")}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    disabled={status === "loading"}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 font-medium">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    disabled={status === "loading"}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 font-medium">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project..."
                    disabled={status === "loading"}
                    {...register("message", {
                      required: "Message is required",
                    })}
                  />
                  {errors.message && (
                    <span className="text-xs text-red-500 font-medium">
                      {errors.message.message}
                    </span>
                  )}
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <p>Something went wrong. Please try again.</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
