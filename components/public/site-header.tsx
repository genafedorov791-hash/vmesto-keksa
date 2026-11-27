import Link from "next/link";
import { ActionArrow } from "./action-arrow";
import { MobileNav } from "./prototype-dialog";
import { directory, sections } from "./site-content";

export function BrandMark({ className = "" }: { className?: string }) {
  return <span className={`brand-mark ${className}`} aria-hidden="true" />;
}

export function SiteHeader({ active, home = false }: { active?: string; home?: boolean }) {
  const booking = home ? "#booking" : "/#booking";

  return (
    <header id="top" className="site-header">
      <a className="skip-link" href="#main-content">К основному содержанию</a>
      <div className="layout site-header__inner">
        <Link href="/" className="site-brand">
          <BrandMark />
          <span>Вместо Кекса</span>
        </Link>
        <nav className="site-nav" aria-label="Основная навигация">
          {sections.map(({ href, label }) => (
            <Link key={href} href={home && href.startsWith("/#") ? href.slice(1) : href} aria-current={href === active ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <a className="site-header__booking button button--outline" href={booking}>Забронировать <ActionArrow /></a>
        <MobileNav active={active} home={home} />
      </div>
    </header>
  );
}

export function MobileDock() {
  return (
    <nav className="mobile-dock" aria-label="Быстрые действия">
      <a href={directory.phoneHref}>Позвонить</a>
      <Link href="/menu">Меню</Link>
      <a href="#booking">Бронь <ActionArrow /></a>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="layout site-footer__inner">
        <Link href="/" className="site-brand"><BrandMark /><span>Вместо Кекса</span></Link>
        <Link href="/#contacts">Контакты</Link>
        <a href={directory.phoneHref}>{directory.phone}</a>
      </div>
    </footer>
  );
}
