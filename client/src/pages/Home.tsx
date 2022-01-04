import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getUser } from "../gateway";
import { IUser } from "../types";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser();
      if (response) {
        setUser(response);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <div>
      <Header loading={loading} user={user} />
      <h1>Home</h1>
    </div>
  );
}
