import { ContactPage } from '@/views/ContactPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('en', { page: 'contact' });

export default function Page() {
  return <ContactPage locale="en" />;
}
