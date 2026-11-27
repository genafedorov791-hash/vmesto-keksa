import type { Metadata } from "next";
import { previewEvent } from "../../../../components/public/event-content";
import { EventsPage } from "../../../../components/public/events-page";

export const metadata: Metadata = { title: "Афиша · локальное превью", robots: { index: false, follow: false } };

export default function EventsPreview() {
  return <EventsPage events={[previewEvent]} preview />;
}
