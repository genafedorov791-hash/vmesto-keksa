import { ActionArrow } from "./action-arrow";
import { BookingForm } from "./booking-form";
import { Hero, MobileDock, SiteHeader, type CoverVariant } from "./cover";
import { photos } from "./photo-assets";
import { PhotoSlot } from "./photo-slot";
import { AtmosphereGallery, PreviewDialog } from "./prototype-dialog";
import { availabilityLabels, dishPrice, menuDishes } from "./menu-catalog";
import { directory } from "./site-content";

function Introduction() {
  return (
    <section id="about" tabIndex={-1} className="section introduction" aria-labelledby="about-title">
      <div className="container grid intro-grid">
        <div className="intro-copy">
          <p className="eyebrow">О ресторане</p>
          <h2 id="about-title">Вместо спешки<br /><em>время для себя</em></h2>
          <p className="section-copy">Утром здесь встречаются за завтраком, вечером собираются за ужином. Панорамные окна, живые растения и европейская кухня задают характер небольшого ресторана.</p>
        </div>
        <PhotoSlot className="intro-detail" asset={photos.aboutDetail} />
        <figure className="intro-room">
          <PhotoSlot asset={photos.aboutRoom} />
        </figure>
      </div>
    </section>
  );
}

function Gastronomy() {
  return (
    <section id="menu" tabIndex={-1} className="section gastronomy" aria-labelledby="menu-title">
      <div className="container gastronomy-layout">
        <div className="gastronomy-heading">
          <h2 id="menu-title">Гастрономия</h2>
          <div className="gastronomy-action">
            <a href="/menu" className="button button--light button--arrow"><span>Смотреть всё меню</span><ActionArrow /></a>
          </div>
        </div>
        <div className="dish-grid">
          {menuDishes.filter((dish) => dish.featuredOnHome).map((dish) => dish.photo && (
            <article className="dish-item" key={dish.id}>
              <PreviewDialog
                title={dish.title}
                className="dish-trigger"
                trigger={
                  <>
                    <PhotoSlot asset={photos[dish.photo]} className="dish-photo" sizes={dish.id === "filet" ? "(max-width: 48rem) 90vw, (max-width: 64rem) 45vw, 30vw" : "(max-width: 48rem) 45vw, 22vw"} />
                    <span className="dish-caption">
                      <span className="dish-title">{dish.title}</span>
                      <span className="dish-description">{dish.description}</span>
                      {dish.priceKopecks !== null && <span className="dish-price">{dishPrice(dish.priceKopecks)}</span>}
                      {availabilityLabels[dish.availability] && <span className="dish-availability">{availabilityLabels[dish.availability]}</span>}
                    </span>
                  </>
                }
              >
                <PhotoSlot asset={photos[dish.photo]} sizes="(max-width: 44rem) 88vw, 36rem" />
                {dish.detail && <p>{dish.detail}</p>}
                {(dish.priceKopecks !== null || availabilityLabels[dish.availability]) && (
                  <p className="dish-dialog-status">{[dishPrice(dish.priceKopecks), availabilityLabels[dish.availability]].filter(Boolean).join(" · ")}</p>
                )}
              </PreviewDialog>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Breakfast() {
  return (
    <section id="breakfast" tabIndex={-1} className="section breakfast" aria-labelledby="breakfast-title">
      <div className="container grid breakfast-grid">
        <figure className="breakfast-photo">
          <PhotoSlot asset={photos.breakfast} />
        </figure>
        <div className="breakfast-copy">
          <p className="eyebrow">Завтраки</p>
          <h2 id="breakfast-title">Начать день<br /><em>за столом</em></h2>
          <p className="section-copy">Скрэмбл с креветками, картофельной роти и кремом из авокадо.</p>
          <a href="/breakfast" className="button button--dark button--arrow button--quiet"><span>Смотреть завтраки</span><ActionArrow /></a>
        </div>
      </div>
    </section>
  );
}

function Atmosphere() {
  return (
    <section id="atmosphere" tabIndex={-1} className="atmosphere" aria-labelledby="atmosphere-title">
      <div className="container">
        <div className="atmosphere-heading">
          <div>
            <p className="eyebrow">Атмосфера</p>
            <h2 id="atmosphere-title">Вместо переписки <em>встреча</em></h2>
          </div>
        </div>
      </div>
      <div className="atmosphere-gallery">
        <div className="container">
          <AtmosphereGallery />
          <div className="event-link">
            <PreviewDialog title="Мероприятия" className="button button--light button--arrow button--quiet" trigger={<><span>Обсудить мероприятие</span><ActionArrow /></>}>
              <a className="text-link" href={directory.phoneHref}>Позвонить в ресторан</a>
            </PreviewDialog>
          </div>
        </div>
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="booking" tabIndex={-1} className="section booking" aria-labelledby="booking-title">
      <div className="container grid booking-grid">
        <div className="booking-copy">
          <p className="eyebrow">Бронирование</p>
          <h2 id="booking-title">Собраться<br /><em>за одним столом</em></h2>
          <a className="text-link" href={directory.phoneHref}>Забронировать по телефону</a>
        </div>
        <div className="booking-form-column"><BookingForm /></div>
      </div>
    </section>
  );
}

function Contacts() {
  return (
    <footer id="contacts" tabIndex={-1} className="section contacts" aria-labelledby="contacts-title">
      <div className="container">
        <div className="grid contacts-grid">
          <div className="contacts-copy">
            <p className="eyebrow">Контакты</p>
            <h2 id="contacts-title">Увидимся <em>за столом</em></h2>
          </div>
          <dl className="contact-details">
            <div><dt>Адрес</dt><dd>Ставрополь, ул. {directory.address}</dd></div>
            <div>
              <dt>Режим работы</dt>
              <dd className="contact-hours">
                {directory.hours.map(({ days, time }) => <span key={days}>{days} <span>{time}</span></span>)}
              </dd>
            </div>
            <div><dt>Телефон</dt><dd><a className="text-link" href={directory.phoneHref}>{directory.phone}</a></dd></div>
            <div><dt>Маршрут</dt><dd><a className="text-link" href={directory.directionsHref}>Как добраться</a></dd></div>
          </dl>
        </div>
        <div className="footer-bottom">
          <a className="brand" href="#top">Вместо Кекса</a>
          <div className="legal-links">
            <PreviewDialog title="Источники" trigger="Источники" className="plain-action">
              <p>Фотографии из Pexels и Unsplash использованы для оформления сайта.</p>
              <p>Адрес, телефон и режим работы по данным <a href={directory.href}>{directory.name}</a>.</p>
            </PreviewDialog>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomePage({ variant }: { variant: CoverVariant }) {
  return (
    <div className={`site-frame site-frame--${variant}`}>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero variant={variant} />
        <Introduction />
        <Gastronomy />
        <Breakfast />
        <Atmosphere />
        <Booking />
      </main>
      <Contacts />
      <MobileDock />
    </div>
  );
}
