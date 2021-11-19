import type {LoaderFunction} from "remix";
import {useLoaderData} from "remix";

export const loader: LoaderFunction = function loader({ params }) {
    return {
        userData: {
            name: params["id"],
            reversedName: params["id"]?.split("").reverse().join("")
        }
    }
}

export default function UserDetails() {
    const data = useLoaderData();
    
    return <p>If you reverse {data.userData.name}, you get {data.userData.reversedName}</p>
}