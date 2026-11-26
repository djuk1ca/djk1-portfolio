import { AboutPage } from '@/views/AboutPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('en', { page: 'about' });

export default function Page() {
  return <AboutPage locale="en" />;
}
