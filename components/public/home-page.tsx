import { ActionArrow } from "./action-arrow";
import { BookingForm } from "./booking-form";
import { Hero, MobileDock, SiteHeader, type CoverVariant } from "./cover";
import { photos } from "./photo-assets";
import { PhotoSlot } from "./photo-slot";
import { AtmosphereGallery, PreviewDialog } from "./prototype-dialog";
import { directory, dishPrice, featuredPreview } from "./site-content";

function Introduction() {
  return (
    <section id="about" tabIndex={-1} className="section introduction" aria-labelledby="about-title">
      <div className="container grid intro-grid">
        <div className="intro-copy">
          <p className="eyebrow">О ресторане</p>
          <h2 id="about-title">Вместо спешки —<br /><em>время для себя</em></h2>
          <p className="section-copy">Утром здесь встречаются за завтраком, вечером собираются за ужином. Панорамные окна, живые растения и европейская кухня задают характер небольшого бистро.</p>
        </div>
        <PhotoSlot className="intro-detail" asset={photos.aboutDetail} />
        <figure className="intro-room">
          <PhotoSlot asset={photos.aboutRoom} />
          <figcaption>Иллюстративные кадры</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Gastronomy() {
  return (
    <section id="menu" tabIndex={-1} className="section gastronomy" aria-labelledby="menu-title">
      <div className="gastronomy-band">
        <div className="container gastronomy-heading">
          <div>
            <p className="eyebrow">Из меню</p>
            <h2 id="menu-title">Гастрономия</h2>
          </div>
          <p className="preview-note">Демонстрационная подборка по описаниям edagda. Фотографии иллюстративные. Цены и наличие уточняются.</p>
        </div>
      </div>
      <div className="container gastronomy-body">
        <div className="grid dish-grid">
          {featuredPreview.map((dish) => (
            <article className="dish-item" key={dish.id}>
              <PreviewDialog
                title={dish.title}
                className="dish-trigger"
                trigger={
                  <>
                    <PhotoSlot asset={photos[dish.id]} className="dish-photo" />
                    <span className="dish-caption">
                      <span className="dish-category">{dish.category}</span>
                      <span className="dish-title">{dish.title}</span>
                      <span className="dish-description">{dish.description}</span>
                      <span className="dish-price">{dishPrice(dish.priceKopecks)}</span>
                      <span className="dish-availability">{dish.availability}</span>
                    </span>
                  </>
                }
              >
                <PhotoSlot asset={photos[dish.id]} sizes="(max-width: 44rem) 88vw, 36rem" />
                <p className="picture-note">Иллюстративная фотография</p>
                <p>{dish.detail}</p>
                <p className="dish-dialog-status">{dishPrice(dish.priceKopecks)} · {dish.availability}</p>
              </PreviewDialog>
            </article>
          ))}
        </div>
        <div className="gastronomy-action">
          <PreviewDialog title="Меню" className="button button--dark button--arrow" trigger={<><span>Открыть меню</span><ActionArrow /></>}>
            <p>Демонстрационная подборка. Состав, цены и наличие подлежат подтверждению.</p>
            <ul className="preview-menu">
              {featuredPreview.map((dish) => (
                <li key={dish.id}>
                  <span className="preview-menu__name">{dish.title}</span>
                  <span className="preview-menu__price">{dishPrice(dish.priceKopecks)}</span>
                </li>
              ))}
            </ul>
          </PreviewDialog>
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
          <figcaption>Иллюстративная фотография завтрака</figcaption>
        </figure>
        <div className="breakfast-copy">
          <p className="eyebrow">Завтраки</p>
          <h2 id="breakfast-title">Начать день<br /><em>за столом</em></h2>
          <p className="section-copy">Скрэмбл с креветками, картофельной роти и кремом из авокадо.</p>
          <p className="breakfast-hours">{directory.breakfastHours} <span>· по данным edagda, уточняется</span></p>
          <PreviewDialog title="Меню завтраков" className="text-link" trigger="Смотреть завтраки">
            <p>В edagda упоминаются скрэмбл с креветками, полента со шпинатом и страчателлой и рисовая каша с клубникой на кокосовом молоке.</p>
            <p>Демонстрационная подборка. Точные часы подачи, состав, цены и наличие уточняются.</p>
          </PreviewDialog>
        </div>
      </div>
    </section>
  );
}

function Atmosphere() {
  return (
    <section id="atmosphere" tabIndex={-1} className="section atmosphere" aria-labelledby="atmosphere-title">
      <div className="container">
        <div className="atmosphere-heading">
          <div>
            <p className="eyebrow">Атмосфера</p>
            <h2 id="atmosphere-title">Вместо переписки — <em>встреча</em></h2>
          </div>
          <p className="picture-note">Иллюстративные кадры</p>
        </div>
        <AtmosphereGallery />
        <div className="event-link">
          <PreviewDialog title="Мероприятия" className="text-link" trigger="Обсудить мероприятие">
            <p>Демонстрационный раздел. Контакты для обсуждения мероприятий появятся после согласования.</p>
          </PreviewDialog>
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
          <p className="section-copy">Выберите дату, время и число гостей, чтобы посмотреть, как устроена заявка.</p>
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
            <p className="contact-source">Адрес, телефон и часы по данным <a href={directory.href}>{directory.name}</a>. Требуется подтверждение.</p>
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
            <PreviewDialog title="Личное обращение" trigger="Написать руководителю" className="plain-action">
              <p>Канал для личных обращений появится после согласования.</p>
            </PreviewDialog>
            <PreviewDialog title="Политика и согласие" trigger="Политика и согласие" className="plain-action">
              <p>Документы и сведения об операторе появятся после согласования. В локальном прототипе используются только тестовые данные.</p>
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
