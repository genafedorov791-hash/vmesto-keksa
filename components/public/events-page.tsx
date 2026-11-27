import Link from "next/link";
import { ActionArrow } from "./action-arrow";
import type { RestaurantEvent } from "./event-content";
import { photos } from "./photo-assets";
import { PhotoSlot } from "./photo-slot";
import { BrandMark, SiteFooter, SiteHeader } from "./site-header";

function EventTime({ event }: { event: RestaurantEvent }) {
  return <time dateTime={event.date}>{event.dayLabel} <span>{event.timeLabel}</span></time>;
}

export function EventsPage({ events, preview = false }: { events: readonly RestaurantEvent[]; preview?: boolean }) {
  return (
    <>
      <SiteHeader active="/events" />
      <main className="layout events-page" id="main-content" tabIndex={-1}>
        <header className="events-masthead">
          {preview && <p className="kicker preview-label">Превью · тестовые данные</p>}
          <h1>Афиша</h1>
          <p>Встречи и события в ресторане «Вместо Кекса».</p>
        </header>
        {events.length ? (
          <div className="events-list">
            {events.map((event) => (
              <article className="event-card" key={event.slug}>
                <Link href={`${preview ? "/preview" : ""}/events/${event.slug}`} className="event-card__link">
                  <PhotoSlot asset={photos[event.photo]} sizes="(max-width: 48rem) 90vw, 53vw" />
                  <div className="event-card__copy">
                    <EventTime event={event} />
                    <h2>{event.title}</h2>
                    <p>{event.summary}</p>
                    <span className="event-card__more">О событии <ActionArrow /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="events-empty">
            <BrandMark />
            <p>Ближайшие события пока не объявлены.</p>
            <Link className="button button--outline" href="/menu">Посмотреть меню <ActionArrow /></Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

export function EventDetail({ event, preview = false }: { event: RestaurantEvent; preview?: boolean }) {
  const listingHref = preview ? "/preview/events" : "/events";
  return (
    <>
      <SiteHeader active="/events" />
      <main className="layout events-page event-page" id="main-content" tabIndex={-1}>
        <Link href={listingHref} className="text-link">← К афише</Link>
        <article className="event-story">
          <div className="event-story__copy">
            {preview && <p className="kicker preview-label">Превью · тестовые данные</p>}
            <EventTime event={event} />
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            <div className="event-registration">
              <button className="button button--ink" type="button" disabled>Записаться <ActionArrow /></button>
              <p>{preview ? "Запись в превью недоступна." : "Запись пока закрыта."}</p>
            </div>
          </div>
          <PhotoSlot asset={photos[event.photo]} priority sizes="(max-width: 48rem) 90vw, 50vw" />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
