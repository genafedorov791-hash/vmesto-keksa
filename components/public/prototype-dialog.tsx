"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from "react";
import { ActionArrow } from "./action-arrow";
import { photos } from "./photo-assets";
import { PhotoSlot } from "./photo-slot";
import { galleryFrames, sections } from "./site-content";

function Dialog({
  dialogRef,
  title,
  className = "",
  children,
  onClose,
  onKeyDown,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  className?: string;
  children: ReactNode;
  onClose: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void;
}) {
  const titleId = useId();

  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Tab") {
      const controls = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]"),
      );
      const first = controls[0];
      const last = controls.at(-1);
      const boundary = event.shiftKey ? first : last;
      const next = event.shiftKey ? last : first;

      if (boundary === document.activeElement && next) {
        event.preventDefault();
        next.focus();
        return;
      }
    }
    onKeyDown?.(event);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={`prototype-dialog ${className}`}
      onClose={onClose}
      onKeyDown={handleKeys}
    >
      <div className="dialog-heading">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="dialog-close" aria-label="Закрыть" onClick={() => dialogRef.current?.close()}>
          <span aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function PreviewDialog({
  title,
  trigger,
  className,
  children,
}: {
  title: string;
  trigger: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={button}
        type="button"
        className={className}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        {trigger}
      </button>
      <Dialog dialogRef={dialog} title={title} onClose={() => button.current?.focus({ preventScroll: true })}>
        {children}
      </Dialog>
    </>
  );
}

export function MobileNav({ active, home }: { active?: string; home: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const destination = useRef<string | null>(null);

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    destination.current = event.currentTarget.pathname === window.location.pathname ? event.currentTarget.hash : null;
    dialog.current?.close();
  }

  function restoreFocus() {
    if (destination.current) {
      document.querySelector<HTMLElement>(destination.current)?.focus({ preventScroll: true });
      destination.current = null;
      return;
    }
    button.current?.focus({ preventScroll: true });
  }

  return (
    <div className="compact-nav">
      <button
        ref={button}
        type="button"
        className="mobile-menu-button"
        aria-label="Открыть меню"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <span>Меню</span>
        <span className="menu-lines" aria-hidden="true" />
      </button>
      <Dialog dialogRef={dialog} title="Меню сайта" className="navigation-dialog" onClose={restoreFocus}>
        <nav aria-label="Мобильная навигация">
          {sections.map(({ href, label }) => (
            <a key={href} href={home && href.startsWith("/#") ? href.slice(1) : href} aria-current={href === active ? "page" : undefined} onClick={navigate}>{label}</a>
          ))}
        </nav>
        <a href={home ? "#booking" : "/#booking"} className="button button--ink" onClick={navigate}><span>Забронировать столик</span><ActionArrow /></a>
      </Dialog>
    </div>
  );
}

export function AtmosphereGallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const active = galleryFrames[index];

  function move(direction: number) {
    setIndex((current) => (current + direction + galleryFrames.length) % galleryFrames.length);
  }

  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  return (
    <>
      <div className="atmosphere-photos">
        {galleryFrames.map((frame, position) => (
          <button
            key={frame.title}
            type="button"
            className="gallery-item"
            aria-haspopup="dialog"
            onClick={(event) => {
              opener.current = event.currentTarget;
              setIndex(position);
              dialog.current?.showModal();
            }}
          >
            <PhotoSlot asset={photos[frame.asset]} />
            <span className="sr-only">{frame.title}</span>
          </button>
        ))}
      </div>
      <Dialog
        dialogRef={dialog}
        title={active.title}
        className="gallery-dialog"
        onClose={() => opener.current?.focus({ preventScroll: true })}
        onKeyDown={handleKeys}
      >
        <PhotoSlot asset={photos[active.asset]} sizes="(max-width: 52rem) 88vw, 45rem" />
        <div className="gallery-dialog__controls">
          <button type="button" className="text-link" onClick={() => move(-1)}>Предыдущий кадр</button>
          <span className="sr-only" role="status">{active.title}, кадр {index + 1} из {galleryFrames.length}</span>
          <button type="button" className="text-link" onClick={() => move(1)}>Следующий кадр</button>
        </div>
      </Dialog>
    </>
  );
}
