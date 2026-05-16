<script setup lang="ts">
import { ref } from "vue";
import { TextField } from "../../components/";
import { useRussianPhoneMask } from "../../composables/useRussianPhoneMask";

const status = ref<"idle" | "sending" | "success" | "error">("idle");
const message = ref("");
const { phone, handlePhoneInput, resetPhone } = useRussianPhoneMask();

async function submitFeedback(event: Event) {
    const form = event.currentTarget as HTMLFormElement;

    status.value = "sending";
    message.value = "";

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                Accept: "application/json",
            },
        });

        const result = await response.json().catch(() => null) as { message?: string } | null;

        if (!response.ok) {
            throw new Error(result?.message ?? "Не удалось отправить заявку");
        }

        form.reset();
        resetPhone();
        status.value = "success";
        message.value = result?.message ?? "Заявка отправлена. Мы скоро свяжемся с вами.";
    } catch (error) {
        status.value = "error";
        message.value = error instanceof Error
            ? error.message
            : "Не удалось отправить заявку";
    }
}
</script>

<template>
    <form
        class="bg-white max-w-3xl w-full p-8 flex flex-col gap-3 rounded-2xl"
        action="/api/feedback"
        method="POST"
        @submit.prevent="submitFeedback"
    >
        <TextField
            id="contactname"
            name="contactname"
            placeholder="Иван Петров"
            label="Имя"
            autocomplete="name"
            required
        />
        <TextField
            name="phone"
            v-model="phone"
            placeholder="+7 (___) ___-__-__"
            label="Телефон"
            autocomplete="tel"
            required
            @input="handlePhoneInput"
        />
        <TextField
            name="event"
            placeholder="Свадьба, День рождения, Корпоратив..."
            label="Название мероприятия"
            required
        />

        <button
            type="submit"
            class="text-white rounded px-3 py-2 w-full primary-gradient disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="status === 'sending'"
        >
            {{ status === "sending" ? "Отправляем..." : "Отправить" }}
        </button>

        <p
            v-if="message"
            class="text-sm"
            :class="status === 'success' ? 'text-green-700' : 'text-red-600'"
            role="status"
            aria-live="polite"
        >
            {{ message }}
        </p>
    </form>
</template>
