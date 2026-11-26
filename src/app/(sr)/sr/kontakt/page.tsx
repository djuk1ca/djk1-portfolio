import { ContactPage } from '@/views/ContactPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('sr', { page: 'contact' });

export default function Page() {
  return <ContactPage locale="sr" />;
}
