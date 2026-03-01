<script setup lang="ts">
import Button from "./Button.vue";

const handleClick = () => {
    console.log("enter");
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    document.querySelector<HTMLInputElement>("#contactname")?.focus();
};
</script>

<template>
    <Button text="Заказать зеркало" variant="primary" @click="handleClick" />
</template>
