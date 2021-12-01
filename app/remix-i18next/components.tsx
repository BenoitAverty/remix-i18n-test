import {createContext, ReactNode, useContext, useEffect, useRef} from "react";
import {i18n} from "i18next";
import {I18nextProvider} from "react-i18next";
import {useMatches, useTransition} from "remix";
import {matchClientRoutes} from "@remix-run/react/routeMatching";
import {createClientRoutes} from "@remix-run/react/routes";

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
    const data = i18n.getDataByLanguage(language);
    
    // Save route ids for which translations are loaded
    const fetchedTranslationsRouteId = useRef<string[]>(typeof window != "undefined" ? window.__remixContext.matches.map(m => m.route.id) : [])
    
    const nextLocation = useTransition().location?.pathname;
    useEffect(() => {
        if(nextLocation) {
            let clientRoutes = createClientRoutes(window.__remixManifest.routes, window.__remixContext.routeModules, () => null);
            let nextMatches = matchClientRoutes(clientRoutes, nextLocation);
            const nextRoutesIds: string[] = nextMatches?.map(match => match.route.id) ?? []
            console.log(nextRoutesIds)
            
            const requests = nextRoutesIds
                .filter(id => !fetchedTranslationsRouteId.current.includes(id))
                .map(id => 
                    fetch(`/i18n/${language}/${encodeURIComponent(id)}`)
                        .then(resp => resp.json())
                        .then(translations => {
                            Object.entries(translations).forEach(([ns, bundle]) => {
                                i18n.addResourceBundle(language, ns, bundle, true, true);
                            })
                            fetchedTranslationsRouteId.current.push(id)
                        })
                );
            
            Promise.all(requests).then(() => i18n.changeLanguage(language));
        }
    }, [nextLocation])

    return (<script 
        type="text/javascript" 
        dangerouslySetInnerHTML={{__html: `window.__i18nextBundle = ${JSON.stringify({data, language})}`}}
    />)
}