import {Link, LoaderFunction} from "remix";
import {i18n} from "../../lib/i18n.server";
import {Trans, useTranslation} from "react-i18next";

export const loader: LoaderFunction = async function loader({request}) {
    return {
        i18n: await i18n.getTranslations(request, "usersIndex")
    }
}

export default function UsersIndex() {
    const {t} = useTranslation("usersIndex")
    
    return (
        <p><Trans t={t} i18nKey={"users-index-msg"}>
            Please select a user or go to <Link to={"/"}>home</Link>
        </Trans></p>
    );
}