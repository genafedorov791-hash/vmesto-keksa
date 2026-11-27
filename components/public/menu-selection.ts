import { menuDishes, type Availability, type MenuDish } from "./menu-catalog";

const storageKey = "vmesto-keksa:menu-selection:v1";
const changeEvent = "vmesto-keksa:menu-selection";
export const maximumMenuQuantity = 99;

type SavedDish = {
  id: string;
  quantity: number;
  priceKopecks: number | null;
  availability: Availability;
};

let memory = "";
let memoryOnly = false;

export function getMenuSelection() {
  if (memoryOnly) return memory;
  try {
    return window.localStorage.getItem(storageKey) ?? "";
  } catch {
    return memory;
  }
}

export function subscribeMenuSelection(callback: () => void) {
  const storageChanged = (event: StorageEvent) => {
    if (event.key === null || event.key === storageKey) callback();
  };
  window.addEventListener("storage", storageChanged);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", storageChanged);
    window.removeEventListener(changeEvent, callback);
  };
}

function readSelection(raw: string): SavedDish[] {
  if (!raw) return [];
  try {
    const items: unknown = JSON.parse(raw);
    if (!Array.isArray(items)) return [];
    const distinct = new Set<string>();
    return items.filter((item): item is SavedDish => {
      if (!item || typeof item !== "object" ||
        typeof item.id !== "string" || distinct.has(item.id) ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > maximumMenuQuantity ||
        (item.priceKopecks !== null && (!Number.isSafeInteger(item.priceKopecks) || item.priceKopecks < 0)) ||
        !["available", "unverified", "sold-out"].includes(item.availability)) return false;
      distinct.add(item.id);
      return true;
    });
  } catch {
    return [];
  }
}

export function setMenuQuantity(dish: MenuDish, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > maximumMenuQuantity) return;
  const items = readSelection(getMenuSelection());
  const current = items.find((item) => item.id === dish.id);
  if (dish.availability === "sold-out" && quantity > (current?.quantity ?? 0)) return;
  const remaining = items.filter((item) => item.id !== dish.id);
  if (quantity > 0) {
    const item = { id: dish.id, quantity, priceKopecks: dish.priceKopecks, availability: dish.availability };
    if (current) remaining.splice(items.indexOf(current), 0, item);
    else remaining.push(item);
  }
  writeSelection(remaining);
}

export function selectionSummary(raw: string, catalog: readonly MenuDish[] = menuDishes) {
  const saved = readSelection(raw);
  const items = saved.map((choice) => {
    const dish = catalog.find(({ id }) => id === choice.id) ?? null;
    const price = dish?.priceKopecks ?? null;
    const unavailable = !dish || dish.availability === "sold-out";
    return {
      ...choice,
      dish,
      price,
      unavailable,
      priceChanged: !!dish && choice.priceKopecks !== price,
      availabilityChanged: !!dish && choice.availability !== dish.availability,
    };
  });

  let total = 0;
  let priced = 0;
  let missingPrice = 0;
  let unavailable = 0;
  for (const item of items) {
    if (item.unavailable) unavailable += item.quantity;
    else if (item.price === null) missingPrice += item.quantity;
    else {
      total += item.price * item.quantity;
      priced += item.quantity;
    }
  }
  return { items, total, priced, missingPrice, unavailable, count: priced + missingPrice + unavailable };
}

export function removeMenuChoice(id: string) {
  writeSelection(readSelection(getMenuSelection()).filter((choice) => choice.id !== id));
}

function writeSelection(items: readonly SavedDish[]) {
  memory = JSON.stringify(items);
  try {
    window.localStorage.setItem(storageKey, memory);
    memoryOnly = false;
  } catch {
    memoryOnly = true;
  }
  window.dispatchEvent(new Event(changeEvent));
}
