import "i18next";

import enEncyclopedia from "../../locales/en/encyclopedia.json";
import enHome from "../../locales/en/home.json";
import enInbox from "../../locales/en/inbox.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "home";
    resources: {
      home: typeof enHome;
      encyclopedia: typeof enEncyclopedia;
      inbox: typeof enInbox;
    };
  }
}
