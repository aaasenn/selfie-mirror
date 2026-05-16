import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const json = (body: { message: string }, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getField = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const toEmail = import.meta.env.CONTACT_EMAIL;
const fromEmail = import.meta.env.RESEND_FROM;

export const POST: APIRoute = async ({ request }) => {
  if (!toEmail || !fromEmail) {
    return json(
      { message: "Email settings are not configured on the server." },
      500,
    );
  }

  const formData = await request.formData();
  const contactName = getField(formData, "contactname");
  const phone = getField(formData, "phone");
  const eventName = getField(formData, "event");

  if (!contactName || !phone || !eventName) {
    return json({ message: "Заполните все поля формы." }, 400);
  }

  const subject = `Новая заявка: ${eventName}`;
  const text = [
    "Новая заявка с сайта Selfie Mirror",
    "",
    `Имя: ${contactName}`,
    `Телефон: ${phone}`,
    `Мероприятие: ${eventName}`,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      html: `
        <h2>Новая заявка с сайта Selfie Mirror</h2>
        <p><strong>Имя:</strong> ${escapeHtml(contactName)}</p>
        <p><strong>Телефон:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Мероприятие:</strong> ${escapeHtml(eventName)}</p>
      `,
    });

    if (error) {
      console.error("Resend email error", error);
      if (error.statusCode === 403) {
        return json(
          {
            message:
              "Resend отклонил отправку. Для тестового отправителя укажите email владельца Resend-аккаунта или подтвердите домен в Resend.",
          },
          502,
        );
      }

      return json({ message: "Не удалось отправить заявку." }, 502);
    }

    return json({ message: "Заявка отправлена. Мы скоро свяжемся с вами." });
  } catch (error) {
    console.error("Feedback endpoint error", error);
    return json({ message: "Не удалось отправить заявку." }, 500);
  }
};
