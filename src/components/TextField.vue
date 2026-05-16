<script setup lang="ts">
withDefaults(defineProps<{
    id?: string;
    label?: string;
    modelValue?: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    autocomplete?: string;
}>(), {
    type: "text",
});

const emit = defineEmits<{
    "update:modelValue": [value: string];
    input: [event: Event];
}>();

function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;

    emit("update:modelValue", input.value);
    emit("input", event);
}
</script>

<template>
    <div class="w-full flex flex-col items-start gap-2">
        <label class="text-sm" v-if="label" :for="id ?? name">{{ label }}</label>
        <input
            :type="type"
            :id="id ?? name"
            :name="name"
            :value="modelValue"
            :placeholder="placeholder"
            :required="required"
            :autocomplete="autocomplete"
            class="input"
            @input="handleInput"
        />
    </div>
</template>
