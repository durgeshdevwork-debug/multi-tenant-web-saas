import Image from "next/image";
import { publicApi } from "../lib/publicApi";

export default async function AboutPage() {
  const about = await publicApi.about();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">{about?.heading ?? "About Us"}</h1>
      <p className="text-lg text-zinc-600 whitespace-pre-line">
        {about?.description ?? "Share your company story here."}
      </p>

      {about?.showTeam && (about.teamMembers?.length ?? 0) > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Team</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {about.teamMembers?.map((member) => (
              <div key={member.name} className="rounded-lg border p-4">
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg bg-zinc-100">
                  {member.imageUrl ? (
                    <Image src={member.imageUrl} alt={member.name} fill className="object-cover" unoptimized />
                  ) : null}
                </div>
                <div className="font-semibold">{member.name}</div>
                <div className="text-sm text-zinc-600">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
