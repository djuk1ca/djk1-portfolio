import { HomePage } from '@/views/HomePage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('sr', { page: 'home' });

export default function Page() {
  return <HomePage locale="sr" />;
}
