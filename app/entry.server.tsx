import ReactDOMServer from "react-dom/server";
import type {EntryContext} from "remix";
import {RemixServer} from "remix";
import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import { RemixI18NextProvider } from "remix-i18next";

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    await i18next.use(initReactI18next)
        .init({
            supportedLngs: ["en", "fr"],
            defaultNS: "common",
            fallbackLng: "en",
            react: {
                useSuspense: false
            }
        })

    let markup = ReactDOMServer.renderToString(
        <RemixI18NextProvider i18n={i18next}>
            <RemixServer context={remixContext} url={request.url}/>
        </RemixI18NextProvider>
    );

    responseHeaders.set("Content-Type", "text/html");

    return new Response("<!DOCTYPE html>" + markup, {
        status: responseStatusCode,
        headers: responseHeaders
    });
}
