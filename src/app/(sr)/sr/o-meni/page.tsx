import { AboutPage } from '@/views/AboutPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('sr', { page: 'about' });

export default function Page() {
  return <AboutPage locale="sr" />;
}
