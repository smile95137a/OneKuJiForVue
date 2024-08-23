<template>
  <div
    :class="['mselect', { error: !!error, 'mselect--open': isOpen }]"
    ref="selectRef"
  >
    <div class="mselect__select" @click="toggleSelectBox">
      <p class="mselect__select-text">
        {{ selectedLabel }}
      </p>

      <div v-if="isOpen" class="mselect__select-icon">
        <i class="fa-solid fa-caret-up"></i>
      </div>
      <div v-else class="mselect__select-icon">
        <i class="fa-solid fa-caret-down"></i>
      </div>
    </div>
    <div v-if="isOpen" class="mselect__options">
      <div
        v-for="(option, index) in options"
        :key="index"
        :class="['mselect__option', { active: option.value === modelValue }]"
        @click="handleOptionClick(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
    <input
      type="hidden"
      :id="inputId"
      :name="name"
      :value="modelValue"
      ref="inputRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Option {
  value: string;
  label: string;
}

interface MSelectProps {
  inputId?: string;
  name?: string;
  options: Option[];
  modelValue: string;
  error?: string;
}

// 接收props
const props = defineProps<MSelectProps>();
const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const toggleSelectBox = () => {
  isOpen.value = !isOpen.value;
};

const handleOptionClick = (optionValue: string) => {
  emit('update:modelValue', optionValue);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

const selectedLabel = computed(() => {
  return (
    props.options.find((option) => option.value === props.modelValue)?.label ||
    ''
  );
});
</script>

<style scoped>
/* 添加與樣式相關的CSS */
</style>
