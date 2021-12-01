import type {LoaderFunction} from "remix";
import {json} from "remix";
import {backend} from "../lib/i18n.server";
import type {RouteManifest, ServerRoute} from "@remix-run/server-runtime/routes"
import {loadTranslations} from "../remix-i18next/i18nResource";

export const loader: LoaderFunction = async function loader({params }) {
    let allRoutes: RouteManifest<ServerRoute> = require(__filename).routes;
    const language = params.language ?? "en";
    const routeId = params.routeId ?? "";
    return json(await loadTranslations(backend, allRoutes, language, routeId));
}