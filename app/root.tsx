import type {LinksFunction, LoaderFunction, RouteHandle} from "remix";
import {
    Meta,
    Links,
    Scripts,
    useLoaderData,
    LiveReload,
    useCatch
} from "remix";
import {Outlet} from "react-router-dom";

import stylesUrl from "./styles/global.css";
import {useTranslation} from "react-i18next";
import {RemixI18NextScript} from "./remix-i18next";

export let handle: RouteHandle = {
    i18nextNs: "common"
} 

export let links: LinksFunction = () => {
    return [{rel: "stylesheet", href: stylesUrl}];
};

export let loader: LoaderFunction = async ({request}) => {
    return {
        date: new Date(),
    };
};

function Document({
                      children,
                      title
                  }: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <link rel="icon" href="/favicon.png" type="image/png"/>
            {title ? <title>{title}</title> : null}
            <Meta/>
            <Links/>
        </head>
        <body>
        {children}
        <RemixI18NextScript />
        <Scripts/>
        {process.env.NODE_ENV === "development" && <LiveReload/>}
        </body>
        </html>
    );
}

export default function App() {
    let data = useLoaderData();
    
    const {t} = useTranslation("common")

    return (
        <Document>
            <Outlet/>
            <footer>
                <p>{t("generated-date-msg", {date: data.date.toLocaleString()})}</p>
            </footer>
        </Document>
    );
}

export function CatchBoundary() {
    let caught = useCatch();

    switch (caught.status) {
        case 401:
        case 404:
            return (
                <Document title={`${caught.status} ${caught.statusText}`}>
                    <h1>
                        {caught.status} {caught.statusText}
                    </h1>
                </Document>
            );

        default:
            throw new Error(
                `Unexpected caught response with status: ${caught.status}`
            );
    }
}

export function ErrorBoundary({error}: { error: Error }) {
    console.error(error);

    return (
        <Document title="Uh-oh!">
            <h1>App Error</h1>
            <pre>{error.message}</pre>
            <p>
                Replace this UI with what you want users to see when your app throws
                uncaught errors.
            </p>
        </Document>
    );
}
