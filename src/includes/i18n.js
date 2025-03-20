import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import uk from "@/locales/uk.json";

export default createI18n({
  legacy: true,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    uk,
  },
  numberFormats: {
    en: {
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
    uk: {
      currency: {
        style: "currency",
        currency: "UAH",
      },
    },
  },
});
