import type {LoaderFunction} from "remix";
import {Link, Outlet, useLoaderData} from "remix";
import {Trans, useTranslation} from "react-i18next";

export let handle = {
    i18nextNs: ["users"]
}

export let loader: LoaderFunction = async () => {
  return { users: ["Pikachu", "Bulbizarre"] };
};

export default function Index() {
  let data = useLoaderData();
  let { t } = useTranslation("users")

  return (
    <div>
      <h2>{t("users-title")}</h2>
      <p><Trans t={t} i18nKey={"users-backlink"}>Go to <Link to={"/"}>home</Link>.</Trans></p>
        
        <ul>
          {data.users.map((u: string) => <li key={u}><Link to={u}>{u}</Link></li>)}
        </ul>
        
        <Outlet />
    </div>
  );
}
