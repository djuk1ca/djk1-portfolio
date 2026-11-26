import { notFoundMetadata } from '@/lib/seo';
import { NotFoundPage } from '@/views/NotFoundPage';

export const metadata = notFoundMetadata('en');

export default function NotFound() {
  return <NotFoundPage locale="en" />;
}
