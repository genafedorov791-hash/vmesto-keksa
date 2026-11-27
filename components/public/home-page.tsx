import Image from "next/image";
import Link from "next/link";
import { ActionArrow } from "./action-arrow";
import { BookingForm } from "./booking-form";
import { dishPrice, menuDishes, servingLabel } from "./menu-catalog";
import { photos } from "./photo-assets";
import { PhotoSlot } from "./photo-slot";
import { AtmosphereGallery, PreviewDialog } from "./prototype-dialog";
import { MobileDock, SiteHeader } from "./site-header";
import { directory } from "./site-content";

function Hero() {
  const desktop = photos.hero;
  const mobile = photos.heroMobile;

  return (
    <section className="layout home-hero" aria-labelledby="hero-title">
      <div className="home-hero__copy">
        <p className="kicker">Ресторан <span>Ставрополь</span></p>
        <h1 id="hero-title"><span>Вместо</span> <em>Кекса</em></h1>
        <div className="home-hero__actions">
          <Link href="/menu" className="button button--ink">Смотреть меню <ActionArrow /></Link>
          <a className="button button--outline" href="#booking">Забронировать столик <ActionArrow /></a>
        </div>
        <a className="home-hero__address" href="#contacts">ул. Дзержинского, 133</a>
      </div>
      <figure className="home-hero__photo">
        <picture>
          <source
            media="(max-width: 48rem)" width={mobile.width} height={mobile.height}
            srcSet={`/assets/restaurant/hero-mobile-420.webp 420w, /assets/restaurant/hero-mobile-740.webp 740w, ${mobile.src} ${mobile.width}w`}
            sizes="calc(100vw - 36px)"
          />
          <img
            className="home-hero__image" src={desktop.src} alt={desktop.alt}
            width={desktop.width} height={desktop.height} fetchPriority="high" loading="eager"
            srcSet={`/assets/restaurant/hero-940.webp 940w, ${desktop.src} ${desktop.width}w`}
            sizes="(min-width: 90rem) 820px, 55vw"
          />
        </picture>
      </figure>
    </section>
  );
}

const featured = menuDishes.filter(({ featuredOnHome }) => featuredOnHome);

function Gastronomy() {
  return (
    <section id="menu" tabIndex={-1} className="layout home-menu" aria-labelledby="home-menu-title">
      <div className="section-heading">
        <h2 id="home-menu-title">Из нашего меню</h2>
        <Link className="button button--outline" href="/menu">Смотреть всё меню <ActionArrow /></Link>
      </div>
      <div className="home-menu__dishes">
        {featured.map((dish) => (
          <Link className="home-dish" key={dish.id} href={`/menu?dish=${dish.id}`}>
            {dish.photo && <PhotoSlot asset={photos[dish.photo]} sizes="(max-width: 36rem) 91vw, (max-width: 48rem) 46vw, 31vw" />}
            <div className="home-dish__title">
              <h3>{dish.title}</h3>
              <span>{dishPrice(dish.priceKopecks)}</span>
            </div>
            <p>{servingLabel(dish.serving)} · {dish.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Breakfast() {
  return (
    <section id="breakfast" tabIndex={-1} className="layout home-breakfast" aria-labelledby="breakfast-title">
      <PhotoSlot asset={photos.syrniki} sizes="(max-width: 48rem) 92vw, 52vw" />
      <div className="home-breakfast__copy">
        <p className="kicker">Завтраки</p>
        <h2 id="breakfast-title">Начать день<br /><em>за столом</em></h2>
        <p>Сырники с лимонным курдом, омлет с творожным сыром и французский тост с фисташковым кремом.</p>
        <Link href="/breakfast" className="button button--outline">Смотреть завтраки <ActionArrow /></Link>
      </div>
    </section>
  );
}

function Atmosphere() {
  return (
    <section id="about" tabIndex={-1} className="layout home-atmosphere" aria-labelledby="about-title">
      <div className="home-atmosphere__copy">
        <p className="kicker">О ресторане</p>
        <h2 id="about-title">Вместо спешки<br /><em>время для себя</em></h2>
        <p>Встречайтесь за завтраком, оставайтесь на ужин. За большим столом всегда есть повод собраться.</p>
      </div>
      <AtmosphereGallery />
    </section>
  );
}

function Events() {
  return (
    <section className="layout home-events" aria-labelledby="home-events-title">
      <div>
        <h2 id="home-events-title">Афиша</h2>
        <p>Встречи и события в ресторане.</p>
      </div>
      <Link href="/events" className="button button--outline">Смотреть афишу <ActionArrow /></Link>
    </section>
  );
}

function Booking() {
  return (
    <section id="booking" tabIndex={-1} className="home-booking" aria-labelledby="booking-title">
      <div className="layout home-booking__inner">
        <div>
          <p className="kicker">Бронирование</p>
          <h2 id="booking-title">Собраться<br /><em>за одним столом</em></h2>
          <p className="home-booking__note">Онлайн-заявки пока недоступны.</p>
          <a className="text-link" href={directory.phoneHref}>Забронировать по телефону</a>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}

function Contacts() {
  return (
    <footer id="contacts" tabIndex={-1} className="layout home-contacts" aria-labelledby="contacts-title">
      <div>
        <p className="kicker">Контакты</p>
        <h2 id="contacts-title">Увидимся<br /><em>за столом</em></h2>
      </div>
      <address>
        <p>Ставрополь, ул. {directory.address}</p>
        <a href={directory.phoneHref}>{directory.phone}</a>
        <a className="text-link" href={directory.directionsHref}>Как добраться <ActionArrow /></a>
      </address>
      <div className="home-contacts__bottom">
        <Link href="#top" className="site-brand" aria-label="Вместо Кекса, наверх">
          <Image className="home-contacts__signature" src="/assets/restaurant/sugar-signature.webp" alt="" width={312} height={49} unoptimized />
        </Link>
        <PreviewDialog title="Источники" trigger="Источники" className="plain-action">
          <p>Меню, фирменная графика и фотографии предоставлены рестораном.</p>
          <p>Адрес и телефон по данным <a className="text-link" href={directory.href}>{directory.name}</a>.</p>
        </PreviewDialog>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <div className="restaurant-home">
      <SiteHeader home />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Gastronomy />
        <Breakfast />
        <Atmosphere />
        <Events />
        <Booking />
      </main>
      <Contacts />
      <MobileDock />
    </div>
  );
}
