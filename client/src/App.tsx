import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getUser } from "./gateway";
import Contest from "./pages/Contest";
import Episode from "./pages/Episode";
import Home from "./pages/Home";
import { IUser } from "./types";

export default function App() {
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home loading={loading} user={user} />} />
        <Route
          path="/contests/:contestId"
          element={<Contest loading={loading} user={user} />}
        />
        <Route
          path="/contests/:contestId/episodes/:episodeId"
          element={<Episode loading={loading} user={user} />}
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
