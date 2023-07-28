import { useCallback, useEffect, useState } from "react";
import { usePocket } from "../../context/pocketBaseContext";
import { Link, useLocation } from "react-router-dom";
import { Record } from "pocketbase";

export default function UserProfile() {
  const { pb } = usePocket();
  const location = useLocation();
  const username = location.pathname.replaceAll("/", "");

  const [user, setUser] = useState<Record>();
  const [isFetching, setIsFetching] = useState(true);

  const getUser = useCallback(async () => {
    try {
      const res = await pb?.collection("users").getList(1, 1, {
        filter: `username='${username}'`,
      });
      if (res && res.items && res.items[0]) {
        setUser(res.items[0]);
      }
    } catch (error) {
      console.error(error);
    }
    setIsFetching(false);
  }, [username]);

  useEffect(() => {
    getUser();
  }, []);

  if (isFetching) return <>Loading</>;

  if (!user)
    return (
      <>
        user <b>{username}</b> not found
      </>
    );

  return (
    <div>
      <div className="fullname">{user.fullname}</div>
      <div className="username">{user.username}</div>
      <img src={`http://localhost:8090/api/files/users/${user.id}/${user.avatar}`} alt="" />
      <Link to={`/${username}/edit`}>Edit</Link>
    </div>
  );
}
