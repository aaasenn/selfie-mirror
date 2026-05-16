import { ref } from "vue";

const RUSSIAN_PHONE_LENGTH = 11;
const LOCAL_PHONE_LENGTH = 10;

const getDigits = (value: string) => value.replace(/\D/g, "");

const getLocalDigits = (value: string) => {
  const digits = getDigits(value);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("7") || digits.startsWith("8")) {
    return digits.slice(1, RUSSIAN_PHONE_LENGTH);
  }

  return digits.slice(0, LOCAL_PHONE_LENGTH);
};

const getDigitCountBeforeCaret = (value: string, caretPosition: number) =>
  getLocalDigits(value.slice(0, caretPosition)).length;

const removeDigitAt = (digits: string, index: number) =>
  `${digits.slice(0, index)}${digits.slice(index + 1)}`;

const formatLocalDigits = (localDigits: string) => {
  if (!localDigits) {
    return "";
  }

  return formatRussianPhone(`7${localDigits}`);
};

export function formatRussianPhone(value: string) {
  let digits = getDigits(value);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  const localDigits = digits.slice(1, RUSSIAN_PHONE_LENGTH);
  const area = localDigits.slice(0, 3);
  const prefix = localDigits.slice(3, 6);
  const firstPair = localDigits.slice(6, 8);
  const secondPair = localDigits.slice(8, 10);

  let formatted = "+7";

  if (area) {
    formatted += ` (${area}`;
  }

  if (area.length === 3) {
    formatted += ")";
  }

  if (prefix) {
    formatted += ` ${prefix}`;
  }

  if (firstPair) {
    formatted += `-${firstPair}`;
  }

  if (secondPair) {
    formatted += `-${secondPair}`;
  }

  return formatted;
}

export function useRussianPhoneMask() {
  const phone = ref("");

  function handlePhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputEvent = event as InputEvent;
    const previousLocalDigits = getLocalDigits(phone.value);
    let localDigits = getLocalDigits(input.value);
    let caretDigitIndex = getDigitCountBeforeCaret(
      input.value,
      input.selectionStart ?? input.value.length,
    );

    if (
      inputEvent.inputType === "deleteContentBackward" &&
      previousLocalDigits.length === localDigits.length &&
      caretDigitIndex > 0
    ) {
      localDigits = removeDigitAt(localDigits, caretDigitIndex - 1);
      caretDigitIndex -= 1;
    }

    if (
      inputEvent.inputType === "deleteContentForward" &&
      previousLocalDigits.length === localDigits.length &&
      caretDigitIndex < localDigits.length
    ) {
      localDigits = removeDigitAt(localDigits, caretDigitIndex);
    }

    const hasCountryCodeOnly =
      (inputEvent.inputType?.startsWith("insert") ?? false) &&
      (getDigits(input.value) === "7" || getDigits(input.value) === "8");
    const formattedPhone = hasCountryCodeOnly
      ? "+7"
      : formatLocalDigits(localDigits);

    phone.value = formattedPhone;
    input.value = formattedPhone;
    input.setSelectionRange(formattedPhone.length, formattedPhone.length);
  }

  function resetPhone() {
    phone.value = "";
  }

  return {
    phone,
    handlePhoneInput,
    resetPhone,
  };
}
