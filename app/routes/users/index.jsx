import {Link} from "remix";

export default function UsersIndex() {
    return (
        <p>Please select a user, or go to <Link to={"/"}>home</Link>.</p>
    );
}