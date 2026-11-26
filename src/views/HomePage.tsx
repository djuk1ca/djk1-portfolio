import type { Locale } from '@/i18n/locales';
import { SiteShell } from '@/components/shell/SiteShell';

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <SiteShell locale={locale} current={{ page: 'home' }}>
      <section id="services" style={{ minHeight: '80vh' }}>
    <h2>services</h2>
  </section>
  <section id="work" style={{ minHeight: '80vh' }}>
    <h2>work</h2>
  </section>
  <section id="projects" style={{ minHeight: '80vh' }}>
    <h2>projects</h2>
  </section>
  <section id="about" style={{ minHeight: '80vh' }}>
    <h2>about</h2>
  </section>
  <section id="contact" style={{ minHeight: '80vh' }}>
    <h2>contact</h2>
  </section>
    </SiteShell>
  );
}
