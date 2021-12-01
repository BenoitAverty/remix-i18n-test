import type {EntryContext} from "remix";
import i18next, {BackendModule, i18n, ReadCallback} from "i18next";
import {initReactI18next} from "react-i18next";

type Value = string | Language;
export type Language = { [key: string]: Value };

export interface Backend<Messages extends Language = Language> {
    /**
     * Function used to retrieve the translations (server side)
     */
    getTranslations(language: string, namespace: string): Promise<Messages>;
}

export type ServerInstanceOptions = {
    backend: Backend;
}

/**
 * Create the i18next instance that will be used on the server.
 * 
 * Await this function in entry.server.tsx (handleRequest) before starting to render your app, and use the return 
 * value as properties of the RemixI18NextProvider component.
 */
export async function createServerInstance(
    request: Request,
    remixContext: EntryContext,
    options: ServerInstanceOptions
): Promise<{ i18n: i18n, language: string }> {
    const i18nextBackend: BackendModule = {
        type: "backend",
        init(): void {
        },
        read(language: string, namespace: string, callback: ReadCallback): void {
            options.backend.getTranslations(language, namespace)
                .then(value => {
                    callback(null, value);
                })
                .catch(error => {
                    callback(error, null);
                })
        }
    }
    
    // TODO support more ways to set language, also options.
    const language = new URL(request.url).searchParams.get("lng") ?? "en";
    console.debug("Locale is " + language)

    // Is there a better way ? this is probably not public API
    let { matches, routeModules } = remixContext;
    const neededNamespaces: Set<string> = matches
        .flatMap(match => routeModules[match.route.id].handle?.i18nextNs ?? [])
        .reduce((acc, curr) => acc.add(curr), new Set())
    console.debug({ neededNamespaces })

    await i18next
        .use(initReactI18next)
        .use(i18nextBackend)
        .init({
            // TODO : some of this needs to be extracted as options.
            lng: language,
            supportedLngs: ["en", "fr"],
            ns: Array.from(neededNamespaces),
            defaultNS: "common",
            react: {
                useSuspense: false
            },
        })
    console.debug("i18next initialized")
    return { i18n: i18next, language };
}

export type ClientInstanceOptions = {
    /** Function used to get the url needed to load additional translations */
    translationsEndpoint: (language: string, namespace: string) => string; 
}

/**
 * Create the i18next instance that will be used in the browser.
 * 
 * call this function in entry.client.tsx and use the returned promise resolved value as properties of 
 * the RemixI18NextProvider component.
 */
export async function createClientInstance(options: ClientInstanceOptions): Promise<{ i18n: i18n, language: string }> {
    // @ts-ignore
    const {data, language} = window.__i18nextBundle;

    const namespaces = Object.keys(data);
    console.debug("Namespaces : " + namespaces);
    console.debug(JSON.stringify(data, null, 2));

    await i18next
        .use(initReactI18next)
        .init({
            // TODO : some of this needs to be extracted as options.
            supportedLngs: ["en", "fr"],
            lng: language,
            ns: namespaces,
            defaultNS: "common",
            react: {
                useSuspense: false
            }
        })

    Object.entries(data).forEach(([ns, bundle]) => {
        i18next.addResourceBundle(language, ns, bundle);
    })
    
    return { i18n: i18next, language: language };
}