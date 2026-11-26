import { PROJECT_SLUGS } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { ProjectPage } from '@/views/ProjectPage';

export const dynamicParams = false;
export const generateStaticParams = () => PROJECT_SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return pageMetadata('en', { page: 'projects', slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectPage locale="en" slug={slug} />;
}
