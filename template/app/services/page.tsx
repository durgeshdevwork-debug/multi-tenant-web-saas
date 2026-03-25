import Image from "next/image";
import { publicApi } from "../lib/publicApi";

export default async function ServicesPage() {
  const services = await publicApi.services();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Services</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(services ?? []).map((service) => (
          <div key={service.title} className="rounded-xl border p-4">
            <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg bg-zinc-100">
              {service.imageUrl ? (
                <Image src={service.imageUrl} alt={service.title} fill className="object-cover" unoptimized />
              ) : null}
            </div>
            <div className="font-semibold">{service.title}</div>
            <div className="text-sm text-zinc-600">{service.description}</div>
            {service.priceLabel ? (
              <div className="mt-2 text-sm font-medium">{service.priceLabel}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
