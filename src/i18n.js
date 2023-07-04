import { createI18n } from "vue-i18n";

function convertJsonFiles() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      // convert object to this form `{'{'} "key": "value" {'}'}`
      let Obj = locales(key);
      Object.keys(Obj).forEach((e) => {
        if (typeof Obj[e] === "object") {
          Obj[e] = JSON.stringify(Obj[e])
            .replace(/^{/g, `{'{'}`)
            .replace(/}$/g, `{'}'}`);
        }
      });
      messages[locale] = Obj;
    }
  });
  return messages;
}

const i18n = createI18n({
  locale: localStorage.lang || "en",
  fallbackLocale: "en",
  allowComposition: true,
  messages: convertJsonFiles(),
});

export default i18n;
