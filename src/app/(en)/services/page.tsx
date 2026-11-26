import { ServicesPage } from '@/views/ServicesPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('en', { page: 'services' });

export default function Page() {
  return <ServicesPage locale="en" />;
}
