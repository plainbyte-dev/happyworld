import { notFound } from 'next/navigation';
import { getAllPackageSlugs, getPackageBySlug, getRelatedPackages } from '@/lib/packages';
import PackageDetailView from '@/components/package/package-detail-view';

export function generateStaticParams() {
  return getAllPackageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getPackageBySlug(slug);
  if (!detail) return {};
  return {
    title: `${detail.name} — Happy World`,
    description: detail.description,
  };
}

async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getPackageBySlug(slug);
  if (!detail) notFound();

  const related = getRelatedPackages(detail);

  return <PackageDetailView detail={detail} related={related} />;
}

export default PackagePage;
