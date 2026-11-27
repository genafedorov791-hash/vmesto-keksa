"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./booking-form.module.css";

const steps = ["Визит", "Место", "Контакты"] as const;
const guestCounts = [1, 2, 3, 4, 5, 6, 7, 8];
const initialVisit = { guests: "2", date: "", time: "" };
const initialContact = { name: "", phone: "", note: "", consent: false };
const sampleContact = { name: "Тестовый гость", phone: "+7 000 000-00-00" };
const moscowDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" });

type Step = 0 | 1 | 2 | 3;
type ValidatedField = "date" | "time" | "name" | "phone" | "consent";
type FormErrors = Partial<Record<ValidatedField, string>>;

export function BookingForm() {
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const [step, setStep] = useState<Step>(0);
  const [visit, setVisit] = useState(initialVisit);
  const [seat, setSeat] = useState("");
  const [contact, setContact] = useState(initialContact);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (moveFocus.current) {
      heading.current?.focus();
      moveFocus.current = false;
    }
  }, [step]);

  function goTo(nextStep: Step) {
    moveFocus.current = true;
    setErrors({});
    setStep(nextStep);
  }

  function clearError(field: ValidatedField) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function showErrors(nextErrors: FormErrors) {
    const firstField = Object.keys(nextErrors)[0];
    if (!firstField) return false;

    setErrors(nextErrors);
    requestAnimationFrame(() => document.getElementById(`${id}-${firstField}`)?.focus());
    return true;
  }

  function goToSeat() {
    const nextErrors: FormErrors = {};
    if (!visit.date) nextErrors.date = "Выберите дату.";
    else if (visit.date < moscowDate.format(new Date())) nextErrors.date = "Выберите сегодняшнюю или будущую дату.";
    if (!visit.time) nextErrors.time = "Выберите время.";
    if (!showErrors(nextErrors)) goTo(1);
  }

  function finish() {
    const nextErrors: FormErrors = {};
    if (contact.name.trim() !== sampleContact.name) nextErrors.name = "Используйте имя «Тестовый гость».";
    if (contact.phone.replace(/[\s()-]/g, "") !== "+70000000000") {
      nextErrors.phone = "Используйте тестовый номер +7 000 000-00-00.";
    }
    if (!contact.consent) nextErrors.consent = "Подтвердите использование тестовых данных.";

    if (!showErrors(nextErrors)) {
      setContact(initialContact);
      goTo(3);
    }
  }

  function fieldAttributes(field: ValidatedField) {
    return {
      id: `${id}-${field}`,
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
    };
  }

  function renderError(field: ValidatedField) {
    return errors[field] && <span className={styles.error} id={`${id}-${field}-error`}>{errors[field]}</span>;
  }

  return (
    <div aria-label="Бронирование" className={styles.form} role="form">
      {step < 3 && (
        <>
          <ol aria-label="Шаги бронирования" className={styles.steps}>
            {steps.map((label, index) => (
              <li aria-current={index === step ? "step" : undefined} data-complete={index < step} key={label}>
                {label}
              </li>
            ))}
          </ol>
        </>
      )}

      {step === 0 && (
        <>
          <h3 className={styles.heading} ref={heading} tabIndex={-1}>Запланируйте визит</h3>
          <div className={styles.visitFields}>
            <div className={styles.field}>
              <label htmlFor={`${id}-guests`}>Гостей</label>
              <span className={styles.select}>
                <select id={`${id}-guests`} value={visit.guests} onChange={(event) => setVisit({ ...visit, guests: event.target.value })}>
                  {guestCounts.map((count) => <option key={count} value={count}>{count}</option>)}
                </select>
              </span>
            </div>
            <div className={styles.field}>
              <label htmlFor={`${id}-date`}>Дата</label>
              <input
                {...fieldAttributes("date")}
                onChange={(event) => {
                  setVisit({ ...visit, date: event.target.value });
                  clearError("date");
                }}
                required
                type="date"
                value={visit.date}
              />
              {renderError("date")}
            </div>
            <div className={styles.field}>
              <label htmlFor={`${id}-time`}>Время</label>
              <input
                {...fieldAttributes("time")}
                onChange={(event) => {
                  setVisit({ ...visit, time: event.target.value });
                  clearError("time");
                }}
                required
                type="time"
                value={visit.time}
              />
              {renderError("time")}
            </div>
          </div>
          <div className={styles.actions}>
            <button className="button button--light" onClick={goToSeat} type="button">Далее</button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h3 className={styles.heading} ref={heading} tabIndex={-1}>Где вам будет уютнее?</h3>
          <fieldset className={styles.seats}>
            <legend>Предпочтение</legend>
            {["Тихое место", "Без предпочтений"].map((label) => (
              <label className={styles.choice} key={label}>
                <input checked={seat === label} name={`${id}-seat`} onChange={() => setSeat(label)} type="radio" />
                {label}
              </label>
            ))}
          </fieldset>
          <div className={styles.actions}>
            <button className={styles.secondary} onClick={() => goTo(0)} type="button">Назад</button>
            <button className={styles.secondary} onClick={() => { setSeat(""); goTo(2); }} type="button">Пропустить</button>
            <button className="button button--light" onClick={() => goTo(2)} type="button">Далее</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className={styles.heading} ref={heading} tabIndex={-1}>Как связаться с гостем?</h3>
          <button
            className={styles.sample}
            onClick={() => {
              setContact({ ...contact, ...sampleContact });
              clearError("name");
              clearError("phone");
            }}
            type="button"
          >
            Заполнить пример
          </button>
          <div className={styles.contactFields}>
            <div className={styles.field}>
              <label htmlFor={`${id}-name`}>Имя</label>
              <input
                {...fieldAttributes("name")}
                autoComplete="off"
                maxLength={60}
                onChange={(event) => {
                  setContact({ ...contact, name: event.target.value });
                  clearError("name");
                }}
                required
                spellCheck={false}
                type="text"
                value={contact.name}
              />
              {renderError("name")}
            </div>
            <div className={styles.field}>
              <label htmlFor={`${id}-phone`}>Телефон</label>
              <input
                {...fieldAttributes("phone")}
                autoComplete="off"
                maxLength={30}
                onChange={(event) => {
                  setContact({ ...contact, phone: event.target.value });
                  clearError("phone");
                }}
                required
                type="tel"
                value={contact.phone}
              />
              {renderError("phone")}
            </div>
            <div className={`${styles.field} ${styles.fullField}`}>
              <label htmlFor={`${id}-note`}>Пожелания <span className={styles.optional}>(по желанию)</span></label>
              <textarea
                id={`${id}-note`}
                autoComplete="off"
                maxLength={300}
                onChange={(event) => setContact({ ...contact, note: event.target.value })}
                rows={2}
                spellCheck={false}
                value={contact.note}
              />
            </div>
          </div>
          <label className={styles.choice}>
            <input
              {...fieldAttributes("consent")}
              checked={contact.consent}
              onChange={(event) => {
                setContact({ ...contact, consent: event.target.checked });
                clearError("consent");
              }}
              required
              type="checkbox"
            />
            Я использую только тестовые данные
          </label>
          {renderError("consent")}
          <div className={styles.actions}>
            <button className={styles.secondary} onClick={() => goTo(1)} type="button">Назад</button>
            <button className="button button--light" onClick={finish} type="button">Завершить</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3 className={styles.heading} ref={heading} tabIndex={-1}>Заявка не отправлена</h3>
          <div className={styles.actions}>
            <button
              className="button button--light"
              onClick={() => { setVisit(initialVisit); setSeat(""); goTo(0); }}
              type="button"
            >
              Начать заново
            </button>
          </div>
        </>
      )}
    </div>
  );
}
