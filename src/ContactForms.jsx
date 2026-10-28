import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, FilePdf, X } from "@phosphor-icons/react";
import { jobs } from "./data/content.js";
import "./contact.css";

export function ContactBanner({ kind = "services", className = "", compact = false, heading, description, buttonText }) {
  const dialog = useRef(null);
  const id = useId();
  const talent = kind === "talent";
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.current.showModal();
    return () => { document.documentElement.style.overflow = previousOverflow; };
  }, [open]);
  const close = () => { dialog.current.close(); setOpen(false); };
  return <>
    <section className={`contact-banner ${talent ? "contact-banner-talent" : ""} ${compact ? "contact-banner-compact" : ""} ${className}`} aria-labelledby={`${id}-banner-title`}>
      <div className="contact-banner-copy">
        <h2 id={`${id}-banner-title`}>{heading || (talent ? "Нет подходящей вакансии?" : "Хотите узнать больше о цифровых решениях ТехВилла?")}</h2>
        <p>{description || (talent ? "Отправь своё резюме и мы с тобой свяжемся!" : "Обсудим вашу задачу. Стоимость рассчитывается индивидуально")}</p>
      </div>
      <button type="button" className="button button-lime" onClick={() => setOpen(true)} aria-haspopup="dialog">{buttonText || (talent ? "Отправить резюме" : "Обсудить проект")}<ArrowRight aria-hidden="true" /></button>
    </section>
    <dialog ref={dialog} className="contact-dialog" aria-labelledby={`${id}-form-title`} aria-describedby={`${id}-form-description`} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} data-lenis-prevent onClick={(event) => { if (event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close(); } }}>
      <button type="button" className="contact-dialog-close" aria-label="Закрыть форму" onClick={close}><X aria-hidden="true" /></button>
      <ContactForm key={talent ? String(open) : undefined} kind={kind} id={id} onClose={close} />
    </dialog>
  </>;
}

export function TalentApplication({ job }) {
  const id = useId();
  const [attempt, setAttempt] = useState(0);
  return <section className="job-application" id="application" aria-label={`Отклик на вакансию ${job.title}`}>
    <ContactForm key={attempt} kind="talent" id={id} job={job} onClose={() => setAttempt((value) => value + 1)} />
  </section>;
}

function ContactForm({ kind, id, onClose, job }) {
  const talent = kind === "talent";
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const successTitle = useRef(null);
  useEffect(() => { if (talent && checked) successTitle.current?.focus(); }, [talent, checked]);
  const errorFor = (input) => {
    if (input.required && (input.type === "checkbox" ? !input.checked : !input.value.trim())) return input.type === "checkbox" ? "Нужно согласие на обработку данных" : "Заполни это поле";
    if (input.name === "name" && input.value.trim().length < 2) return "Укажи имя: минимум два символа";
    if (input.type === "file" && input.files?.[0]) {
      if (!/\.(pdf|doc|docx)$/i.test(input.files[0].name)) return "Выбери резюме в формате PDF, DOC или DOCX";
      if (input.files[0].size > 10 * 1024 * 1024) return "Файл должен быть не больше 10 МБ";
    }
    if (input.type === "email" && input.validity.typeMismatch) return "Проверь адрес, например name@company.ru";
    if (input.name === "phone" && !/^\+?[\d\s()-]{7,25}$/.test(input.value.trim())) return "Укажи телефон с кодом страны, например +7 999 123-45-67";
    if (input.name === "phone" && !/^\d{7,15}$/.test(input.value.replace(/\D/g, ""))) return "В номере должно быть от 7 до 15 цифр";
    if (input.type === "url" && input.value && !/^https?:\/\//i.test(input.value.trim())) return "Добавь полную ссылку, начиная с https://";
    if (input.validity.typeMismatch) return "Проверь формат ссылки";
    return "";
  };
  const validateField = (event) => {
    const input = event.target;
    if (!input.name) return;
    setChecked(false);
    const error = errorFor(input);
    setErrors((previous) => ({ ...previous, [input.name]: error }));
  };
  const submit = (event) => {
    event.preventDefault();
    const controls = [...event.currentTarget.elements].filter((input) => input.name && input.type !== "submit");
    const next = Object.fromEntries(controls.map((input) => [input.name, errorFor(input)]));
    setErrors(next);
    const invalid = controls.find((input) => next[input.name]);
    setChecked(!invalid);
    invalid?.focus();
  };
  const field = (name, label, options = {}) => <div className={`contact-field ${options.wide ? "contact-field-wide" : ""}`}>
    <label htmlFor={`${id}-${name}`}>{label}{options.required && <span aria-hidden="true"> *</span>}</label>
    {options.multiline ? <textarea id={`${id}-${name}`} name={name} rows={3} maxLength={4000} required={options.required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${id}-${name}-error` : undefined} onBlur={validateField} onChange={() => setChecked(false)} /> : <input id={`${id}-${name}`} name={name} type={options.type || "text"} autoComplete={options.autoComplete} inputMode={options.type === "tel" ? "tel" : undefined} maxLength={name === "name" ? 120 : name === "phone" ? 25 : 500} placeholder={options.placeholder} required={options.required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${id}-${name}-error` : undefined} onBlur={validateField} onChange={() => setChecked(false)} />}
    {errors[name] && <p className="contact-error" id={`${id}-${name}-error`}>{errors[name]}</p>}
  </div>;
  // User-approved demo state only. No network request or HR submission is made.
  if (talent && checked) return <section className="contact-success" aria-labelledby={`${id}-form-title`} aria-describedby={`${id}-form-description`}>
    <h2 id={`${id}-form-title`} ref={successTitle} tabIndex={-1}>Посадили семечко 🌱</h2>
    <p id={`${id}-form-description`}>Твой отклик уже у команды. Теперь посмотрим, что из него вырастет.</p>
    <button type="button" className="button button-lime" onClick={onClose}>{job ? "Вернуться к форме" : "Отлично"}<ArrowRight aria-hidden="true" /></button>
  </section>;
  return <form className="contact-form" noValidate onSubmit={submit}>
    <header><h2 id={`${id}-form-title`}>{talent ? "Отправить резюме" : "Обсудим ваш проект"}</h2><p id={`${id}-form-description`}>{talent ? "Заполните форму и приложите резюме. Мы свяжемся с вами в ближайшее время" : "Заполните форму и расскажите, какое решение нужно вашему бизнесу"}</p><p className="contact-required">* Обязательные поля</p></header>
    <div className="contact-fields">
      {field("name", talent ? "Имя" : "ФИО", { required: true, autoComplete: "name" })}
      {talent ? (job ? <div className="contact-field"><label htmlFor={`${id}-position`}>Вакансия</label><input id={`${id}-position`} name="position" readOnly value={job.title} /></div> : <div className="contact-field"><label htmlFor={`${id}-position`}>Выберите позицию <span aria-hidden="true">*</span></label><select id={`${id}-position`} name="position" required defaultValue="" aria-invalid={!!errors.position} aria-describedby={errors.position ? `${id}-position-error` : undefined} onChange={validateField} onBlur={validateField}><option value="" disabled>Выберите позицию</option>{jobs.map((job) => <option value={job.id} key={job.id}>{job.title} · {job.company === "cyberchef" ? "Кибершеф" : "ТехВилл"}</option>)}<option value="other">Другая позиция</option></select>{errors.position && <p className="contact-error" id={`${id}-position-error`}>{errors.position}</p>}</div>) : field("company", "Название компании", { required: true, autoComplete: "organization" })}
      {!talent && field("email", "Email", { required: true, type: "email", autoComplete: "email", placeholder: "name@company.ru" })}
      {field("phone", "Телефон", { required: true, type: "tel", autoComplete: "tel", placeholder: "+7 999 123-45-67" })}
      {talent && field("email", "Email", { required: true, type: "email", autoComplete: "email", placeholder: "name@company.ru" })}
      {field("message", talent ? "Дополнительный комментарий" : "Описание задачи", { wide: true, multiline: true, required: !talent })}
    </div>
    {talent ? <div className="contact-field"><label htmlFor={`${id}-resume`}><FilePdf aria-hidden="true" /> Приложить резюме <span aria-hidden="true">*</span></label><input id={`${id}-resume`} name="resume" type="file" accept=".pdf,.doc,.docx" required aria-invalid={!!errors.resume} aria-describedby={errors.resume ? `${id}-resume-error` : `${id}-resume-help`} onChange={(event) => { setResumeName(event.target.files?.[0]?.name || ""); validateField(event); }} /><small id={`${id}-resume-help`}>{resumeName || "PDF, DOC или DOCX — до 10 МБ"}</small>{errors.resume && <p className="contact-error" id={`${id}-resume-error`}>{errors.resume}</p>}</div> : <div className="contact-upload"><button type="button" disabled><FilePdf aria-hidden="true" />Приложить файл</button><span>Загрузка файлов пока недоступна</span></div>}
    <div className="contact-consent"><input id={`${id}-consent`} type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${id}-consent-error` : undefined} onChange={validateField} /><label htmlFor={`${id}-consent`}>Я даю <a href="https://www.techvill.ru/personal-data" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a> и ознакомлен(а) с <a href="https://www.techvill.ru/privacy-policy" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a></label></div>
    {errors.consent && <p className="contact-error" id={`${id}-consent-error`}>{errors.consent}</p>}
    {!talent && <label className="contact-newsletter"><input type="checkbox" name="newsletter" onChange={() => setChecked(false)} />Хочу получать информационные рассылки (необязательно)</label>}
    <button className="button button-lime" type="submit">{talent ? "Отправить резюме" : "Оставить заявку"}<ArrowRight aria-hidden="true" /></button>
    {!talent && <p className="contact-submit-note" role="status">{checked ? "Поля заполнены верно. Отправка пока не подключена: данные остаются только в этой форме" : "Форма проверяет поля. Передача заявок пока не подключена"}</p>}
  </form>;
}
