import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/adminStore';

export function useRoleGuard(allowedRoles: string[] = []) {
  const router = useRouter();
  const adminStore = useAdminStore();

  onMounted(() => {
    const userRoleId = String(adminStore.user?.roleId);
    if (!allowedRoles.includes(userRoleId)) {
      router.push('/admin-login');
    }
  });
}
