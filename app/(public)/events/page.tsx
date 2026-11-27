import type { Metadata } from "next";
import { restaurantEvents } from "../../../components/public/event-content";
import { EventsPage } from "../../../components/public/events-page";

export const metadata: Metadata = { title: "Афиша ресторана «Вместо Кекса»" };

export default function Events() {
  return <EventsPage events={restaurantEvents} />;
}
