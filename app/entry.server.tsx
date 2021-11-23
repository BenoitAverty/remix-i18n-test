import ReactDOMServer from "react-dom/server";
import type {EntryContext} from "remix";
import {RemixServer} from "remix";
import {backend} from "./lib/i18n.server";
import {createServerInstance, RemixI18NextProvider} from "./remix-i18next";

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    console.debug("start server handleRequest")
    
    const { i18n, language } = await createServerInstance(request, remixContext, {
        backend: backend
    });
    
    let markup = ReactDOMServer.renderToString(
        <RemixI18NextProvider i18n={i18n} language={language}>
            <RemixServer context={remixContext} url={request.url}/>
        </RemixI18NextProvider>
    );

    responseHeaders.set("Content-Type", "text/html");

    return new Response("<!DOCTYPE html>" + markup, {
        status: responseStatusCode,
        headers: responseHeaders
    });
}
