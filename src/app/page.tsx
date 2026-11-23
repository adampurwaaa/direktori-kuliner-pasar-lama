import { getTenants, getActivePromos } from '@/lib/queries';
import { PublicDirectory } from '@/components/public/PublicDirectory';

// Dynamic server-side rendering ensures immediate sync between Admin & Public view
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [tenants, promos] = await Promise.all([
    getTenants(),
    getActivePromos(),
  ]);

  return <PublicDirectory initialTenants={tenants} initialPromos={promos} />;
}
