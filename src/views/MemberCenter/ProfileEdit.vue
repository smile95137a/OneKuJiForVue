<template>
  <div class="memberCenter__profileEdit">
    <MemberCenterCoins />
    <MemberCenterProfileEditForm />
    <MemberCenterProfileEditInvoiceForm />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins.vue';
import MemberCenterProfileEditForm from '@/components/frontend/memberCenter/MemberCenterProfileEditForm.vue';
import MemberCenterProfileEditInvoiceForm from '@/components/frontend/memberCenter/MemberCenterProfileEditInvoiceForm.vue';

onMounted(async () => {});
</script>
