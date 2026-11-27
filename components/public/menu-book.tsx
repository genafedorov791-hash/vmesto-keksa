"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  allergyNote, dishesForMenu, dishPrice, dishTitle, filterMenuDishes, menuAdditions, menuCategories,
  menuCollections, servingLabel, type MenuDish, type MenuKind,
} from "./menu-catalog";
import { getMenuSelection, maximumMenuQuantity, removeMenuChoice, selectionSummary, setMenuQuantity, subscribeMenuSelection } from "./menu-selection";
import { photos } from "./photo-assets";
import { PhotoSlot } from "./photo-slot";
import { PreviewDialog } from "./prototype-dialog";
import { SiteFooter, SiteHeader } from "./site-header";
import "./menu-book.css";

const desktopQuery = "(min-width: 62rem)";
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

type Selection = ReturnType<typeof selectionSummary>;

function DishDetails({ dish, close, selection }: { dish: MenuDish; close: () => void; selection: Selection }) {
  const selected = selection.items.some(({ id }) => id === dish.id);
  const additions = menuAdditions.filter(({ parentId }) => parentId === dish.id);

  return (
    <article id={dishPanelId} className="menu-detail" aria-labelledby="menu-dish-title">
      <button className="menu-detail__close plain-action" type="button" onClick={close}>Закрыть блюдо <span aria-hidden="true">×</span></button>
      {dish.photo && <PhotoSlot asset={photos[dish.photo]} className="menu-detail__photo" sizes="(max-width: 62rem) 88vw, 37vw" />}
      <div className="menu-detail__copy">
        <p className="kicker">{menuCategories[dish.category]}</p>
        <h2 id="menu-dish-title">{dishTitle(dish)}</h2>
        <p className="menu-detail__description">{dish.description}</p>
        <div className="menu-detail__actions">
          <p className="menu-detail__facts"><span>{servingLabel(dish.serving)}</span><strong>{dishPrice(dish.priceKopecks)}</strong></p>
          <button
            type="button" className="button button--ink"
            aria-pressed={selected}
            disabled={dish.availability === "sold-out" && !selected}
            onClick={() => setMenuQuantity(dish, selected ? 0 : 1)}
          >
            <span aria-hidden="true">{selected ? "✓" : "+"}</span>
            {selected ? "В моём выборе" : "В мой выбор"}
          </button>
        </div>
        {dish.availability === "sold-out" && <p>Временно недоступно</p>}
        {additions.length > 0 && (
          <div className="menu-additions">
            <h3>Добавки к омлету</h3>
            {!selected && <p>Добавки можно выбрать вместе с омлетом.</p>}
            <ul aria-label="Добавки к омлету">
              {additions.map((addition) => {
                const chosen = selection.items.some(({ id }) => id === addition.id);
                return (
                  <li key={addition.id}>
                    <div><span>{addition.title}</span><small>{servingLabel(addition.serving)}</small></div>
                    <strong>{dishPrice(addition.priceKopecks)}</strong>
                    <button
                      className="menu-additions__toggle" type="button" disabled={!selected}
                      aria-pressed={chosen} aria-label={`Добавка: ${addition.title}`}
                      onClick={() => setMenuQuantity(addition, chosen ? 0 : 1)}
                    ><span aria-hidden="true">{chosen ? "✓" : "+"}</span></button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

function MenuSelection({ selection }: { selection: Selection }) {
  return (
    <PreviewDialog title="Мой выбор" className="button button--outline menu-selection-trigger" trigger={
      <>Мой выбор{selection.count > 0 && <span className="menu-selection-trigger__count">{selection.count}</span>}</>
    }>
      {selection.count === 0 ? (
        <p>Здесь можно сохранить блюда из обоих меню.</p>
      ) : (
        <>
          <ul className="menu-selection">
            {selection.items.map(({ id, dish, quantity, unavailable, price, priceChanged, availabilityChanged }) => {
              const title = dish ? dishTitle(dish) : "Блюдо снято с меню";
              return (
                <li key={id}>
                  <div>
                    <strong>{title}</strong>
                    {dish && "parentId" in dish && <p>Добавка к омлету</p>}
                    {(unavailable || price !== null) && <p>{unavailable ? "Недоступно" : dishPrice(price)}</p>}
                    {priceChanged && <p>Цена изменилась</p>}
                    {availabilityChanged && !unavailable && <p>Наличие изменилось</p>}
                  </div>
                  <div className="menu-selection__quantity">
                    <button
                      type="button" aria-label={`Убрать порцию. ${title}`}
                      onClick={() => dish && setMenuQuantity(dish, quantity - 1)} disabled={!dish}
                    >−</button>
                    <span aria-label={`Количество порций: ${quantity}`}>{quantity}</span>
                    <button
                      type="button" aria-label={`Добавить порцию. ${title}`}
                      onClick={() => dish && setMenuQuantity(dish, quantity + 1)}
                      disabled={unavailable || quantity >= maximumMenuQuantity}
                    >+</button>
                  </div>
                  <button className="plain-action menu-selection__remove" type="button" aria-label={`Убрать из выбора. ${title}`} onClick={() => removeMenuChoice(id)}>
                    Убрать
                  </button>
                </li>
              );
            })}
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
  const dishes = dishesForMenu(kind);
  const categories = [...new Set(dishes.map((dish) => dish.category))];
  const category = categories.find((value) => value === params.get("category")) ?? "";
  const query = params.get("q") ?? "";
  const visible = filterMenuDishes(dishes, category, query);
  const requested = params.get("dish");
  const initial = desktop ? visible.find((dish) => dish.photo) ?? visible[0] : undefined;
  const active = requested === closedDish ? undefined : visible.find(({ id }) => id === requested) ?? initial;

  function details(dish: MenuDish) {
    return (
      <DishDetails key={dish.id} dish={dish} selection={selection} close={() => {
        updateMenuLocation({ dish: closedDish });
        document.getElementById(`menu-row-${dish.id}`)?.focus();
      }} />
    );
  }

  return (
    <div className={`menu-view menu-view--${kind}`}>
      <SiteHeader active={book.href} />
      <main className="layout menu-book" id="main-content" tabIndex={-1}>
        <div className="menu-masthead">
          <div>
            <nav className="menu-editions" aria-label="Разделы меню">
              {Object.values(menuCollections).map(({ href, title }) => (
                <Link key={href} href={href} aria-current={href === book.href ? "page" : undefined}>{title === "Меню" ? "Всё меню" : title}</Link>
              ))}
            </nav>
            <h1 id="menu-title">{book.title}</h1>
          </div>
          <MenuSelection selection={selection} />
        </div>
        <div className="menu-spread">
          <section className="menu-index" aria-label="Каталог блюд">
            <div className="menu-search" role="search" aria-label="Поиск по меню">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" width="19" height="19"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.25 15.25 5 5" /></svg>
              <input
                type="search" aria-label="Найти блюдо" placeholder="Найти блюдо" maxLength={120}
                value={query}
                onChange={(event) => updateMenuLocation({ q: event.target.value, dish: "" }, true)}
              />
            </div>
            {categories.length > 1 && (
              <div className="menu-categories" role="group" aria-label="Категории блюд">
                <button type="button" aria-pressed={!category} onClick={() => updateMenuLocation({ category: "", dish: "" })}>Все блюда</button>
                {categories.map((value) => (
                  <button key={value} type="button" aria-pressed={category === value} onClick={() => updateMenuLocation({ category: value, dish: "" })}>{menuCategories[value]}</button>
                ))}
              </div>
            )}
            {visible.length > 0 ? (
              <div className="menu-groups">
                {categories.map((group) => {
                  const entries = visible.filter((dish) => dish.category === group);
                  if (!entries.length) return null;
                  return (
                    <section key={group} aria-labelledby={`menu-group-${group}`}>
                      <h2 id={`menu-group-${group}`}>{menuCategories[group]}</h2>
                      <ul className="menu-rows" aria-label={`Блюда: ${menuCategories[group]}`}>
                        {entries.map((dish) => {
                          const open = active?.id === dish.id;
                          return (
                            <li key={dish.id}>
                              <button
                                className="menu-row" id={`menu-row-${dish.id}`} type="button"
                                aria-expanded={open} aria-controls={open ? dishPanelId : undefined}
                                onClick={() => updateMenuLocation({ dish: open ? closedDish : dish.id })}
                              >
                                <span className="menu-row__name">{dish.title}{dish.variant && <small>{dish.variant}</small>}</span>
                                <span className="menu-row__weight">{servingLabel(dish.serving)}</span>
                                <span className="menu-row__price">{dishPrice(dish.priceKopecks)}</span>
                                <span className="menu-row__arrow" aria-hidden="true">{open ? "−" : "+"}</span>
                              </button>
                              {!desktop && open && details(dish)}
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="menu-empty" role="status">
                <p>По этому запросу блюд нет.</p>
                <button className="plain-action" type="button" onClick={() => updateMenuLocation({ category: "", q: "", dish: "" })}>Сбросить поиск и фильтр</button>
              </div>
            )}
          </section>
          <aside className="menu-feature" aria-label="Подробности блюда">
            {desktop && (active ? details(active) : <p>Выберите блюдо, чтобы посмотреть подробности.</p>)}
          </aside>
        </div>
        <p className="menu-allergy">{allergyNote}</p>
      </main>
      <SiteFooter />
    </div>
  );
}
