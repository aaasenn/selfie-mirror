<script setup lang="ts">
interface ButtonProps {
    text: string;
    variant?: "primary" | "secondary";
}

const props = defineProps<ButtonProps>();
const emit = defineEmits(["click"]);

const handleClick = () => {
    emit("click");
};
</script>

<template>
    <div>
        <button
            class="btn"
            :class="
                props.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'
            "
            @click="handleClick"
        >
            <span :class="props.variant === 'secondary' ? '' : 'animate-pulse'">
                {{ props.text }}
            </span>
        </button>
    </div>
</template>
