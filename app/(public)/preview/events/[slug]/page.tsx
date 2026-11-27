import { notFound } from "next/navigation";
import { previewEvent } from "../../../../../components/public/event-content";
import { EventDetail } from "../../../../../components/public/events-page";

export function generateStaticParams() {
  return [{ slug: previewEvent.slug }];
}

export default async function EventPreview({ params }: { params: Promise<{ slug: string }> }) {
  if ((await params).slug !== previewEvent.slug) notFound();
  return <EventDetail event={previewEvent} preview />;
}
