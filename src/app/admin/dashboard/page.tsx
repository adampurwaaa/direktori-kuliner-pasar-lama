import { getAllTenantsAdmin, getAllMenus, getAllPromosAdmin, getClickStatsAdmin } from '@/lib/queries';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [tenants, menus, promos, stats] = await Promise.all([
    getAllTenantsAdmin(),
    getAllMenus(),
    getAllPromosAdmin(),
    getClickStatsAdmin(),
  ]);

  return (
    <AdminDashboardClient
      initialTenants={tenants}
      initialMenus={menus}
      initialPromos={promos}
      initialStats={stats}
    />
  );
}
