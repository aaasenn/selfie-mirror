<script setup lang="ts">
import { TextField } from "../../components/";
</script>

<template>
    <form
        class="bg-white max-w-3xl w-full p-8 flex flex-col gap-3 rounded-2xl"
        action="/feedback"
        method="POST"
    >
        <TextField
            id="contactname"
            name="contactname"
            placeholder="Имя"
            label="Иван Петров"
        />
        <TextField
            name="phone"
            placeholder="+7 (___) ___-__-__"
            label="Телефон"
        />
        <TextField
            name="event"
            placeholder="Свадьба, День рождения, Корпоратив..."
            label="Название мероприятия"
        />

        <button
            type="submit"
            class="text-white rounded px-3 py-2 w-full primary-gradient"
        >
            Отправить
        </button>
    </form>
</template>
