import { notFoundMetadata } from '@/lib/seo';
import { NotFoundPage } from '@/views/NotFoundPage';

export const metadata = notFoundMetadata('sr');

export default function NotFound() {
  return <NotFoundPage locale="sr" />;
}
