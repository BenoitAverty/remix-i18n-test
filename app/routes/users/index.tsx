import {Link, LoaderFunction} from "remix";
import {i18n} from "../../lib/i18n.server";
import {Trans, useTranslation} from "react-i18next";

export const handle = {
    i18nextNs: ["usersIndex"]
}

export default function UsersIndex() {
    const {t} = useTranslation("usersIndex")
    
    return (
        <p><Trans t={t} i18nKey={"users-index-msg"}>
            select or <Link to={"/"}>home</Link>
        </Trans></p>
    );
}