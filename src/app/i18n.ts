import i18n from "i18next"
import Backend from "i18next-xhr-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import {initReactI18next} from "react-i18next"

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: "currentOnly",
    whitelist: ["fr"],
    fallbackLng: "fr",
    debug: process.env.NODE_ENV === "development",
    defaultNS: "default",
    ns: "default",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
