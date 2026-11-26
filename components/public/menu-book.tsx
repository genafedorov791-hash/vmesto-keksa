"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { availabilityLabels, dishPrice, filterMenuDishes, menuCategories, menuCollections, menuDishes, type MenuDish, type MenuKind } from "./menu-catalog";
import { getMenuSelection, maximumMenuQuantity, removeMenuChoice, selectionSummary, setMenuQuantity, subscribeMenuSelection } from "./menu-selection";
import { photos } from "./photo-assets";
import { PhotoSlot } from "./photo-slot";
import { PreviewDialog } from "./prototype-dialog";
import { directory } from "./site-content";
import "./menu-book.css";

const desktopQuery = "(min-width: 64rem)";
const menuEvent = "vmesto-keksa:menu-location";
const dishPanelId = "menu-dish-panel";
const closedDish = "closed";
const emptySnapshot = () => "";
const desktopSnapshot = () => true;
const getSearch = () => window.location.search;
const isDesktop = () => window.matchMedia(desktopQuery).matches;

function subscribeViewport(listener: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function subscribeLocation(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(menuEvent, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(menuEvent, listener);
  };
}

function updateMenuLocation(changes: Record<string, string>, replace = false) {
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);
  for (const [key, value] of Object.entries(changes)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const query = params.toString();
  const url = query ? `${pathname}?${query}` : pathname;
  if (url === pathname + search) return;
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
  window.dispatchEvent(new Event(menuEvent));
}

function DishDetails({
  dish,
  close,
  quantity,
  initial,
}: {
  dish: MenuDish;
  close: () => void;
  quantity: number;
  initial: boolean;
}) {
  const asset = dish.photo ? photos[dish.photo] : null;
  const hasDetails = dish.ingredients !== null || dish.serving !== null || dish.allergens !== null;

  return (
    <article id={dishPanelId} className="menu-detail" aria-labelledby="menu-dish-title">
      <button className="menu-detail__close" type="button" onClick={close}>
        <span aria-hidden="true">×</span> Закрыть блюдо
      </button>
      {asset && (
        <figure className="menu-detail__figure">
          <div className="menu-detail__arch">
            <PhotoSlot asset={asset} priority={initial} sizes="(max-width: 63.99rem) calc(100vw - 72px), 540px" />
          </div>
          {dish.photo === "polenta" && (
            <figcaption>
              <a href="https://commons.wikimedia.org/wiki/File:Polenta_con_i_funghi_(49653224713).jpg">Polenta con i funghi, やましこ</a> / <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a> · WebP, уменьшено
            </figcaption>
          )}
        </figure>
      )}
      <div className="menu-detail__copy">
        <p className="menu-detail__category">{menuCategories[dish.category]}</p>
        <h2 id="menu-dish-title">{dish.title}</h2>
        {dish.detail && <p className="menu-detail__description">{dish.detail}</p>}
        {hasDetails && (
          <dl className="menu-detail__facts">
            {dish.ingredients !== null && <div><dt>Состав</dt><dd>{dish.ingredients.join(", ")}</dd></div>}
            {dish.serving && <div><dt>Порция</dt><dd>{dish.serving.amount} {dish.serving.unit}</dd></div>}
            {dish.allergens !== null && <div><dt>Аллергены</dt><dd>{dish.allergens.join(", ") || "Отсутствуют"}</dd></div>}
          </dl>
        )}
        <div className="menu-detail__actions">
          {(dish.priceKopecks !== null || availabilityLabels[dish.availability]) && (
            <div className="menu-detail__status">
              {dish.priceKopecks !== null && <p>{dishPrice(dish.priceKopecks)}</p>}
              {availabilityLabels[dish.availability] && <p>{availabilityLabels[dish.availability]}</p>}
            </div>
          )}
          <button
            type="button"
            className="menu-pill menu-pill--ink"
            aria-pressed={quantity > 0}
            disabled={dish.availability === "sold-out" && quantity === 0}
            onClick={() => setMenuQuantity(dish, quantity ? 0 : 1)}
          >
            <span aria-hidden="true">{quantity ? "✓" : "+"}</span>
            {quantity ? "В моём выборе" : "В мой выбор"}
          </button>
        </div>
      </div>
    </article>
  );
}

function MenuSelection({ selection }: { selection: ReturnType<typeof selectionSummary> }) {
  return (
    <PreviewDialog title="Мой выбор" className="menu-pill menu-selection-trigger" trigger={
      <>Мой выбор{selection.count > 0 && <span className="menu-selection-trigger__count">{selection.count}</span>}</>
    }>
      {selection.count === 0 ? (
        <p>Здесь можно сохранить блюда из обоих меню.</p>
      ) : (
        <>
          <ul className="menu-selection">
            {selection.items.map(({ id, dish, quantity, unavailable, price, priceChanged, availabilityChanged }) => (
              <li key={id}>
                <div>
                  <strong>{dish?.title ?? "Блюдо снято с меню"}</strong>
                  {(unavailable || price !== null) && <p>{unavailable ? "Недоступно" : dishPrice(price)}</p>}
                  {priceChanged && <p>Цена изменилась</p>}
                  {availabilityChanged && !unavailable && <p>Наличие изменилось</p>}
                </div>
                <div className="menu-selection__quantity">
                  <button
                    type="button"
                    aria-label={`Убрать порцию. ${dish?.title ?? "Блюдо"}`}
                    onClick={() => dish ? setMenuQuantity(dish, quantity - 1) : removeMenuChoice(id)}
                    disabled={!dish}
                  >−</button>
                  <span aria-label={`Количество порций: ${quantity}`}>{quantity}</span>
                  <button
                    type="button"
                    aria-label={`Добавить порцию. ${dish?.title ?? "Блюдо"}`}
                    onClick={() => dish && setMenuQuantity(dish, quantity + 1)}
                    disabled={unavailable || quantity >= maximumMenuQuantity}
                  >+</button>
                </div>
                <button className="menu-selection__remove" type="button" aria-label={`Убрать из выбора. ${dish?.title ?? "Блюдо"}`} onClick={() => removeMenuChoice(id)}>
                  Убрать
                </button>
              </li>
            ))}
          </ul>
          {(selection.priced > 0 || selection.unavailable > 0) && (
            <div className="menu-selection__summary" aria-live="polite">
              {selection.priced > 0 && <p>{selection.missingPrice || selection.unavailable ? "Сумма по известным ценам" : "Итого"} <strong>{dishPrice(selection.total)}</strong></p>}
              {selection.unavailable > 0 && <p>Недоступных порций: {selection.unavailable}</p>}
            </div>
          )}
        </>
      )}
    </PreviewDialog>
  );
}

export function MenuBook({ kind }: { kind: MenuKind }) {
  const book = menuCollections[kind];
  const desktop = useSyncExternalStore(subscribeViewport, isDesktop, desktopSnapshot);
  const search = useSyncExternalStore(subscribeLocation, getSearch, emptySnapshot);
  const saved = useSyncExternalStore(subscribeMenuSelection, getMenuSelection, emptySnapshot);
  const selection = selectionSummary(saved);
  const params = new URLSearchParams(search);
  const dishes = menuDishes.filter((dish) => dish.menus.includes(kind));
  const categories = [...new Set(dishes.map((dish) => dish.category))];
  const category = categories.find((value) => value === params.get("category")) ?? "";
  const query = params.get("q") ?? "";
  const visible = filterMenuDishes(dishes, category, query);
  const requested = params.get("dish");
  const active = requested === closedDish ? undefined : visible.find(({ id }) => id === requested) ?? (desktop ? visible[0] : undefined);

  function details(dish: MenuDish) {
    return (
      <DishDetails
        key={dish.id}
        dish={dish}
        initial={desktop && !search}
        quantity={selection.items.find(({ id }) => id === dish.id)?.quantity ?? 0}
        close={() => {
          updateMenuLocation({ dish: closedDish });
          document.getElementById(`menu-row-${dish.id}`)?.focus({ preventScroll: true });
        }}
      />
    );
  }

  return (
    <div className={`menu-view menu-view--${kind}`}>
      <a className="menu-skip" href="#menu-title">К меню</a>
      <header className="menu-rail">
        <Link href={`/${book.section}`} className="menu-home"><span aria-hidden="true">←</span> На главную</Link>
        <Link href="/" className="menu-wordmark">Вместо Кекса</Link>
        <MenuSelection selection={selection} />
      </header>
      <main className="menu-book" aria-labelledby="menu-title">
        <section className="menu-index" aria-label="Каталог блюд">
          <nav className="menu-editions" aria-label="Разделы меню">
            {Object.values(menuCollections).map(({ href, title }) => (
              <Link key={href} href={href} aria-current={href === book.href ? "page" : undefined}>{title}</Link>
            ))}
          </nav>
          <h1 id="menu-title" tabIndex={-1}>{book.title}</h1>
          <div className="menu-search" role="search" aria-label="Поиск по меню">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" width="19" height="19"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.25 15.25 5 5" /></svg>
            <input
              type="search"
              aria-label="Найти блюдо"
              placeholder="Найти блюдо"
              maxLength={120}
              value={query}
              onChange={(event) => updateMenuLocation({ q: event.target.value, dish: "" }, true)}
            />
          </div>
          <div className="menu-categories" role="group" aria-label="Категории блюд">
            <button type="button" aria-pressed={!category} onClick={() => updateMenuLocation({ category: "", dish: "" })}>Все блюда</button>
            {categories.map((value) => (
              <button key={value} type="button" aria-pressed={category === value} onClick={() => updateMenuLocation({ category: value, dish: "" })}>{menuCategories[value]}</button>
            ))}
          </div>
          {visible.length ? (
            <ul className="menu-rows" aria-label="Блюда">
              {visible.map((dish) => {
                const open = active?.id === dish.id;
                return (
                  <li key={dish.id}>
                    <button
                      className="menu-row"
                      id={`menu-row-${dish.id}`}
                      type="button"
                      aria-expanded={open}
                      aria-controls={open ? dishPanelId : undefined}
                      onClick={() => updateMenuLocation({ dish: open ? closedDish : dish.id })}
                    >
                      <span>{dish.title}</span>
                      <span className="menu-row__arrow" aria-hidden="true">{open ? "−" : "+"}</span>
                    </button>
                    {!desktop && open && details(dish)}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="menu-empty" role="status">
              <p>По этому запросу блюд нет.</p>
              <button type="button" onClick={() => updateMenuLocation({ category: "", q: "", dish: "" })}>Сбросить поиск и фильтр</button>
            </div>
          )}
          <PreviewDialog title="Источники" trigger="Источники" className="menu-source">
            <p>Названия и описания блюд по данным <a href={directory.href}>{directory.name}</a>.</p>
            <p>Фотографии из Pexels, Unsplash и Wikimedia Commons показывают примеры подачи.</p>
          </PreviewDialog>
        </section>
        <div className="menu-spread">
          {desktop && (active ? details(active) : (
            <p className="menu-spread__empty">{visible.length ? "Выберите блюдо слева." : "Попробуйте другой запрос или категорию."}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
