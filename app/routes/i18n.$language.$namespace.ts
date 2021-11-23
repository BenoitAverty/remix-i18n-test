import type {LoaderFunction} from "remix";
import {json} from "remix";
import {backend} from "../lib/i18n.server";

export const loader: LoaderFunction = async function loader({ params }) {
    const bundle = await backend.getTranslations(params.language ?? "",params.namespace ?? "");    
    return json(bundle);
}