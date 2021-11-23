import ReactDOM from "react-dom";
import {RemixBrowser} from "remix";
import {createClientInstance, RemixI18NextProvider} from "./remix-i18next";

createClientInstance({ 
    translationsEndpoint: ((language, namespace) => `/i18n/${language}/${namespace}`)
})
    .then(({i18n, language}) => {
        console.debug("i18next initialized. starting hydration.")
        
        ReactDOM.hydrate(
            <RemixI18NextProvider i18n={i18n} language={language}>
                <RemixBrowser/>
            </RemixI18NextProvider>,
            document
        );
    })
