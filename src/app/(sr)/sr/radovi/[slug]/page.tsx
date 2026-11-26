import { WORK_SLUGS } from '@/i18n/routes';
import { WorkPage } from '@/views/WorkPage';

export const dynamicParams = false;
export const generateStaticParams = () => WORK_SLUGS.map((slug) => ({ slug }));

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WorkPage locale="sr" slug={slug} />;
}
