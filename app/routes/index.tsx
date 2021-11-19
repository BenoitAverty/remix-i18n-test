import type {MetaFunction, LinksFunction, LoaderFunction} from "remix";
import {useLoaderData} from "remix";
import {Link} from "react-router-dom";

import stylesUrl from "../styles/index.css";
import {i18n} from "../lib/i18n.server";
import {useTranslation} from "react-i18next";

export let meta: MetaFunction = () => {
    return {
        title: "Remix Starter",
        description: "Welcome to remix!"
    };
};

export let links: LinksFunction = () => {
    return [{rel: "stylesheet", href: stylesUrl}];
};

export let loader: LoaderFunction = async ({ request }) => {
    return {i18n: await i18n.getTranslations(request, ["common", "users"])};
};

export default function Index() {
    let { t } = useTranslation(["common", "users"])

    return (
        <div style={{textAlign: "center", padding: 20}}>
            <h2>{t("welcome-msg")}</h2>

            <ul>
                <li><Link to={"/users"}>{t("users-title", { ns: "users"})}</Link></li>
            </ul>
        </div>
    );
}
