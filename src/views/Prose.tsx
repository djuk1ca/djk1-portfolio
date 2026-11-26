import type { Section } from '@/content';
import s from './views.module.css';

/** Case-study text on level 0: plain headings and paragraphs, no decoration. */
export function Prose({ sections }: { sections: Section[] }) {
  return (
    <div className={s.prose}>
      {sections.map((sec) => (
        <section key={sec.heading} className={s.prose}>
          <h2 className="heading-2">{sec.heading}</h2>
          {sec.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
