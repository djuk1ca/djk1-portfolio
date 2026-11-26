import { HomePage } from '@/views/HomePage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('en', { page: 'home' });

export default function Page() {
  return <HomePage locale="en" />;
}
