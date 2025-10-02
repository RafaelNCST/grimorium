import "i18next";

import enHome from "../../locales/en/home.json";
import enEncyclopedia from "../../locales/en/encyclopedia.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "home";
    resources: {
      home: typeof enHome;
      encyclopedia: typeof enEncyclopedia;
    };
  }
}
