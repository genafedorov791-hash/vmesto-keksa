import { ActionArrow } from "./action-arrow";
import { HeroWordmark } from "./hero-wordmark";
import { photos } from "./photo-assets";
import { PhotoSlot } from "./photo-slot";
import { MobileNav } from "./prototype-dialog";
import { directory, sections } from "./site-content";

export type CoverVariant = "cinema" | "editorial";

export function SiteHeader() {
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
          <a href="#booking" className="header-booking">
            Бронь <ActionArrow />
          </a>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}

export function Hero({ variant }: { variant: CoverVariant }) {
  const isCinema = variant === "cinema";
  const actionTone = isCinema ? "button--light" : "button--dark";

  return (
    <section className={`hero hero--${variant}`} aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-stage grid">
          <div className="hero-title">
            <p className="eyebrow hero-eyebrow"><span>Гастробистро</span><span>Ставрополь</span></p>
            <h1 id="hero-title">
              {isCinema ? (
                <>
                  <span className="sr-only">Вместо Кекса</span>
                  <HeroWordmark />
                </>
              ) : (
                <><span>Вместо</span>{" "}<em>Кекса</em></>
              )}
            </h1>
          </div>
          <figure className="hero-photo">
            <PhotoSlot asset={photos.hero} sizes={isCinema ? "100vw" : photos.hero.sizes} priority />
            <figcaption>Иллюстративное фото интерьера</figcaption>
          </figure>
          <div className="hero-copy">
            <p className="hero-description">От первого кофе до ужина, за которым хочется задержаться.</p>
            <div className="hero-actions">
              <a href="#booking" className={`button button--arrow ${actionTone}`}>
                <span>Забронировать столик</span><ActionArrow />
              </a>
              <a href="/menu" className={`button button--arrow button--quiet ${actionTone}`}>
                <span>Смотреть меню</span><ActionArrow />
              </a>
            </div>
          </div>
        </div>
        <div className="hero-foot">
          <a href="#contacts" className="plain-action">Ул. {directory.address}</a>
          <span>Демонстрационная версия</span>
        </div>
      </div>
    </section>
  );
}

export function MobileDock() {
  return (
    <nav className="mobile-dock" aria-label="Быстрые действия">
      <a className="mobile-dock__action" href={directory.phoneHref}>Позвонить</a>
      <a href="/menu" className="mobile-dock__action">Меню</a>
      <a href="#booking" className="mobile-dock__action mobile-dock__booking">Бронь <ActionArrow /></a>
    </nav>
  );
}
