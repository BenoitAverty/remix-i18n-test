import type {LoaderFunction} from "remix";
import {useLoaderData} from "remix";
import {i18n} from "../../lib/i18n.server";
import {useTranslation} from "react-i18next";

export const loader: LoaderFunction = async function loader({ request, params }) {
    return {
        i18n: await i18n.getTranslations(request, "userDetails"),
        userData: {
            name: params["id"],
            reversedName: params["id"]?.split("").reverse().join("")
        }
    }
}

export default function UserDetails() {
    const data = useLoaderData();
    const { t } = useTranslation("userDetails");
    
    return <p>{t("users-details-msg", { name: data.userData.name, reverse: data.userData.reversedName})}</p>
}