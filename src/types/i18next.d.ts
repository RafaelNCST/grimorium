import "i18next";

import enCreateBook from "../../locales/en/create-book.json";
import enEncyclopedia from "../../locales/en/encyclopedia.json";
import enHome from "../../locales/en/home.json";
import enInbox from "../../locales/en/inbox.json";
import enOverview from "../../locales/en/overview.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "home";
    resources: {
      home: typeof enHome;
      encyclopedia: typeof enEncyclopedia;
      inbox: typeof enInbox;
      "create-book": typeof enCreateBook;
      overview: typeof enOverview;
    };
  }
}
