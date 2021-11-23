import {createContext, ReactNode, useContext, useEffect} from "react";
import {i18n} from "i18next";
import {I18nextProvider} from "react-i18next";
import {useMatches} from "remix";

const context = createContext<{ i18n: i18n, language: string } | null>(null);

interface RemixI18NextProvider {
    children: ReactNode;
    i18n: i18n;
    language: string;
}

/**
 * Provide the i18n instance to hooks that need it further down the tree.
 * 
 * It renders the I18next provider, no need to add it yourself.
 */
export function RemixI18NextProvider({children, i18n, language}: RemixI18NextProvider) {
    return (
        <context.Provider value={{i18n, language}}>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </context.Provider>
    );
}

/**
 * Put this in your document before the remix <Scripts /> component.
 * 
 * Component responsible of : 
 *  - rendering (on the server) of the script tag used by the client instance to initialize without 
 *  having to fetch the translations. This is necessary to initialize the client instance synchronously 
 *  and avoid an extra fetch request.
 *  - loading new namespaces on client-side navigation. This is the part that could be optimized but
 *  doesn't seem possible currently with what remix provides.
 */
export function RemixI18NextScript() {
    let remixI18nextContext = useContext(context);
    if (!remixI18nextContext) throw new Error("Missing locale or I18Next instance")
    const {i18n, language} = remixI18nextContext;
    const data = i18n.getDataByLanguage(language)

    let matches = useMatches();
    useEffect(() => {
        let newNamespaces = matches.flatMap(m => m.handle?.i18nextNs ?? [])
        i18n.loadNamespaces(newNamespaces);
    }, [matches])

    return (
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: `window.__i18nextBundle = ${JSON.stringify({data, language})}`}}/>)
}