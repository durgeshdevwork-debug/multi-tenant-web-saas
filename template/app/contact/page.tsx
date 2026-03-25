import { publicApi } from "../lib/publicApi";

export default async function ContactPage() {
  const contact = await publicApi.contact();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="text-lg text-zinc-600">
        {contact?.introText ?? "Reach out to start a conversation."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-zinc-500">Address</div>
          <div className="mt-2 text-sm">{contact?.address ?? "No address provided."}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-zinc-500">Phone</div>
          <div className="mt-2 text-sm">{contact?.phone ?? "No phone provided."}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-zinc-500">Email</div>
          <div className="mt-2 text-sm">{contact?.email ?? "No email provided."}</div>
        </div>
      </div>
    </section>
  );
}
