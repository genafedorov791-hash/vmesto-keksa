import { BookingForm } from "../../components/public/booking-form";
import { PhotoSlot } from "../../components/public/photo-slot";
import { AtmosphereGallery, MobileNav, PreviewDialog } from "../../components/public/prototype-dialog";
import { dishSlots, sections } from "../../components/public/site-content";

function PhonePreview({ className }: { className?: string }) {
  return (
    <PreviewDialog title="Телефон ресторана" trigger="Позвонить" className={className}>
      <p>Подтверждённый номер появится в разделе контактов.</p>
    </PreviewDialog>
  );
}

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
          <PhonePreview className="plain-action" />
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
          <div className="hero-photo">
            <PhotoSlot caption="Место для фотографии интерьера" tone="pine" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span>Гастробистро</span><span>Ставрополь</span></p>
            <h1 id="hero-title"><span>Вместо</span>{" "}<em>Кекса</em></h1>
            <div className="hero-actions">
              <a href="#booking" className="button button--light">Забронировать столик</a>
              <a href="#menu" className="text-link">Смотреть меню</a>
            </div>
          </div>
        </div>
        <div className="hero-foot">
          <a href="#contacts" className="plain-action">Адрес уточняется</a>
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
          <p className="section-copy">«Вместо Кекса» — гастробистро в Ставрополе. Здесь можно начать день с завтрака, встретиться за обедом или провести вечер за одним столом.</p>
        </div>
        <PhotoSlot className="intro-detail" caption="Место для фотографии детали" tone="sand" />
        <PhotoSlot className="intro-room" caption="Место для фотографии зала" tone="olive" />
      </div>
    </section>
  );
}

function Gastronomy() {
  return (
    <section id="menu" tabIndex={-1} className="section gastronomy" aria-labelledby="menu-title">
      <div className="container">
        <div className="gastronomy-heading">
          <h2 id="menu-title">Гастрономия</h2>
          <p className="section-copy">Демонстрационные позиции. Блюда, цены и наличие появятся после согласования меню.</p>
        </div>
        <div className="grid dish-grid">
          {dishSlots.map(({ title, caption, tone }) => (
            <div className="dish-item" key={title}>
              <PreviewDialog
                title={title}
                className="dish-trigger"
                trigger={
                  <>
                    <PhotoSlot caption={caption} tone={tone} />
                    <span className="dish-caption">
                      <span className="dish-title">{title}</span>
                      <span className="dish-meta">Цена и наличие уточняются</span>
                    </span>
                  </>
                }
              >
                <PhotoSlot caption={caption} tone={tone} />
                <p>Демонстрационная позиция. Описание, состав, цена и наличие появятся после согласования меню.</p>
              </PreviewDialog>
            </div>
          ))}
        </div>
        <div className="gastronomy-action">
          <PreviewDialog title="Меню" className="button button--dark" trigger="Открыть меню">
            <p>Демонстрационный раздел. Здесь будут категории и позиции с подтверждёнными ценами.</p>
            <p>Макет раздела «Завтраки» доступен на главной странице.</p>
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
        <PhotoSlot className="breakfast-photo" caption="Место для фотографии завтрака" tone="chalk" />
        <div className="breakfast-copy">
          <p className="eyebrow">Завтраки</p>
          <h2 id="breakfast-title">Начать день<br /><em>за столом</em></h2>
          <p className="section-copy">Меню и часы подачи завтраков уточняются.</p>
          <PreviewDialog title="Меню завтраков" className="text-link" trigger="Смотреть завтраки">
            <p>Демонстрационная категория. Позиции, цены и часы подачи появятся после согласования.</p>
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
          <p className="eyebrow">Атмосфера</p>
          <h2 id="atmosphere-title">Вместо переписки — <em>встреча</em></h2>
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
          </div>
          <dl className="contact-details">
            <div><dt>Адрес</dt><dd>Ставрополь. Адрес уточняется.</dd></div>
            <div><dt>Режим работы</dt><dd>Уточняется</dd></div>
            <div><dt>Телефон</dt><dd>Уточняется</dd></div>
            <div>
              <dt>Маршрут</dt>
              <dd>
                <PreviewDialog title="Маршрут" className="text-link" trigger="Как добраться">
                  <p>Ссылка на карту появится после подтверждения адреса.</p>
                </PreviewDialog>
              </dd>
            </div>
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
        <PhonePreview className="mobile-dock__action" />
        <a href="#menu" className="mobile-dock__action">Меню</a>
        <a href="#booking" className="mobile-dock__action mobile-dock__booking">Бронь</a>
      </nav>
    </>
  );
}
