import ReactDOM from "react-dom";
import {RemixBrowser} from "remix";
import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import { RemixI18NextProvider } from "remix-i18next";

i18next
    .use(initReactI18next)
    .init({
        supportedLngs: ["en", "fr"],
        defaultNS: "common",
        fallbackLng: "en",
        react: {
            useSuspense: false
        }
    })
    .then(() => {
        ReactDOM.hydrate(
            <RemixI18NextProvider i18n={i18next}><RemixBrowser/></RemixI18NextProvider>,
            document
        );
    })
