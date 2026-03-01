<script setup lang="ts">
const { label, name, placeholder } = defineProps<{
    label?: string;
    name: string;
    placeholder?: string;
}>();
</script>

<template>
    <div class="w-full flex flex-col items-start gap-2">
        <label class="text-sm" v-if="label" :for="name">{{ label }}</label>
        <input
            type="text"
            :id="name"
            :name="name"
            :placeholder="placeholder"
            class="input"
        />
    </div>
</template>
