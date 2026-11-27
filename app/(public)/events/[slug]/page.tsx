import { notFound } from "next/navigation";
import { restaurantEvents } from "../../../../components/public/event-content";
import { EventDetail } from "../../../../components/public/events-page";

export default async function Event({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = restaurantEvents.find((entry) => entry.slug === slug);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
