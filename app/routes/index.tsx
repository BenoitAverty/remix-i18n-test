import type {MetaFunction, LinksFunction, LoaderFunction} from "remix";
import {Link} from "react-router-dom";

import stylesUrl from "../styles/index.css";
import {useTranslation} from "react-i18next";

export let handle = {
    i18nextNs: ["common", "users"]
}

export let meta: MetaFunction = () => {
    return {
        title: "Remix Starter",
        description: "Welcome to remix!"
    };
};

export let links: LinksFunction = () => {
    return [{rel: "stylesheet", href: stylesUrl}];
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
