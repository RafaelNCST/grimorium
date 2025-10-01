import "i18next";

import enHome from "../../locales/en/home.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "home";
    resources: {
      home: typeof enHome;
    };
  }
}
