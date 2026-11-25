import { BookingForm } from "../../components/public/booking-form";
import { photos } from "../../components/public/photo-assets";
import { PhotoSlot } from "../../components/public/photo-slot";
import { AtmosphereGallery, MobileNav, PreviewDialog } from "../../components/public/prototype-dialog";
import { directory, dishPrice, featuredPreview, sections } from "../../components/public/site-content";

function SiteHeader() {
  return (
    <header id="top" className="site-header">
      <a className="skip-link" href="#main-content">К основному содержанию</a>
      <div className="container header-inner">
        <a className="brand" href="#top">Вместо Кекса</a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {sections.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a href={directory.phoneHref} className="plain-action">Позвонить</a>
          <a href="#booking" className="button button--outline">Забронировать столик</a>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-stage grid">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span>Гастробистро</span><span>Ставрополь</span></p>
            <h1 id="hero-title"><span>Вместо</span>{" "}<em>Кекса</em></h1>
            <p className="hero-description">От первого кофе до ужина, за которым хочется задержаться.</p>
            <div className="hero-actions">
              <a href="#booking" className="button button--light">Забронировать столик</a>
              <a href="#menu" className="text-link">Смотреть меню</a>
            </div>
          </div>
          <figure className="hero-photo">
            <PhotoSlot asset={photos.hero} priority />
            <figcaption>Иллюстративное фото интерьера</figcaption>
          </figure>
        </div>
        <div className="hero-foot">
          <a href="#contacts" className="plain-action">Ул. {directory.address}</a>
          <span>Демонстрационная версия</span>
        </div>
      </div>
    </section>
  );
}

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
      <div className="container">
        <div className="gastronomy-heading">
          <div>
            <p className="eyebrow">Из меню</p>
            <h2 id="menu-title">Гастрономия</h2>
          </div>
          <p className="preview-note">Демонстрационная подборка по описаниям edagda. Фотографии иллюстративные. Цены и наличие уточняются.</p>
        </div>
        <div className="grid dish-grid">
          {featuredPreview.map((dish) => (
            <article className="dish-item" key={dish.id}>
              <PhotoSlot asset={photos[dish.id]} className="dish-photo" />
              <div className="dish-caption">
                <p className="dish-category">{dish.category}</p>
                <PreviewDialog
                  title={dish.title}
                  className="dish-trigger"
                  headingClassName="dish-title"
                  trigger={dish.title}
                >
                  <PhotoSlot asset={photos[dish.id]} sizes="(max-width: 44rem) 88vw, 36rem" />
                  <p className="picture-note">Иллюстративная фотография</p>
                  <p>{dish.detail}</p>
                  <p className="dish-dialog-status">{dishPrice(dish.priceKopecks)} · {dish.availability}</p>
                </PreviewDialog>
                <p className="dish-description">{dish.description}</p>
                <p className="dish-price">{dishPrice(dish.priceKopecks)}</p>
                <p className="dish-availability">{dish.availability}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="gastronomy-action">
          <PreviewDialog title="Меню" className="button button--dark" trigger="Открыть меню">
            <p>Демонстрационная подборка. Состав, цены и наличие подлежат подтверждению.</p>
            <ul className="preview-menu">
              {featuredPreview.map((dish) => (
                <li key={dish.id}><span>{dish.title}</span><span>{dishPrice(dish.priceKopecks)}</span></li>
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Introduction />
        <Gastronomy />
        <Breakfast />
        <Atmosphere />
        <Booking />
      </main>
      <Contacts />
      <nav className="mobile-dock" aria-label="Быстрые действия">
        <a className="mobile-dock__action" href={directory.phoneHref}>Позвонить</a>
        <a href="#menu" className="mobile-dock__action">Меню</a>
        <a href="#booking" className="mobile-dock__action mobile-dock__booking">Бронь</a>
      </nav>
    </>
  );
}
