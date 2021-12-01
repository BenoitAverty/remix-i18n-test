import type {ServerRoute, ServerRouteManifest} from "@remix-run/server-runtime/routes";
import {Backend} from "./instance";

export async function loadTranslations(backend: Backend, allRoutes: ServerRouteManifest, language: string, routeId: string) {
    const route: Omit<ServerRoute, "children"> = allRoutes[routeId];
    let namespaces: string[] = [route.module.handle?.i18nextNs ?? []].flat();

    const translations = namespaces
        .map(n => backend.getTranslations(language, n).then(t => ({[n]: t})))

    return Object.assign({}, ...await Promise.all(translations));
}