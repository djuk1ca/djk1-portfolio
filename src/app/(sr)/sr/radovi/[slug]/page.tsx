import { WORK_SLUGS } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { WorkPage } from '@/views/WorkPage';

export const dynamicParams = false;
export const generateStaticParams = () => WORK_SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return pageMetadata('sr', { page: 'work', slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WorkPage locale="sr" slug={slug} />;
}
