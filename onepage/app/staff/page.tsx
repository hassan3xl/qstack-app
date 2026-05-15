import { StaffCard, StaffMember } from "../../components/StaffCard";
import { backendUrl } from "../../lib/services/apiService";

async function getStaffMembers(): Promise<StaffMember[]> {
  try {
    const res = await fetch(`${backendUrl}/staff/`, {
      next: { revalidate: 60 },
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

export default async function StaffPage() {
  const staffMembers = await getStaffMembers();
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
            Our Amazing Team
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Meet the <span className="text-primary">Innovators</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We are a diverse team of engineers, designers, and strategists
            united by our passion for building exceptional software solutions.
          </p>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="container mx-auto px-4 w-11/12 pb-20 md:pb-32">
        {staffMembers.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {staffMembers.map((member) => (
              <StaffCard key={member.id} member={member} className="h-full" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Our team information is currently being updated. Please check back
              soon!
            </p>
          </div>
        )}
      </section>

      {/* Join Us CTA */}
      <section className="container mx-auto w-11/12 py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl mb-12">
        <div className="flex flex-col items-center text-center gap-6 px-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Want to join our team?
          </h2>
          <p className="text-muted-foreground max-w-lg">
            We&apos;re always looking for talented individuals who share our
            passion for innovation and excellence.
          </p>
          <a
            href="/careers"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </div>
  );
}
