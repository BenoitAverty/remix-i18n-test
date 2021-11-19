import type {LoaderFunction} from "remix";
import {Link, Outlet, useLoaderData} from "remix";

export let loader: LoaderFunction = async () => {
  return { users: ["Pikachu", "Bulbizarre"] };
};

export default function Index() {
  let data = useLoaderData();

  return (
    <div>
      <h2>Users</h2>
      <p>Go to <Link to={"/"}>home</Link>.</p>
        
        <ul>
          {data.users.map((u: string) => <li><Link to={u}>{u}</Link></li>)}
        </ul>
        
        <Outlet />
    </div>
  );
}
