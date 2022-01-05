import React, { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getContests } from "../gateway";
import { IContest, IUser } from "../types";

interface HomeProps {
  loading: boolean;
  user: IUser | undefined;
}

export default function Home({ loading, user }: HomeProps) {
  const [contests, setContests] = useState<IContest[]>([]);

  useEffect(() => {
    const fetchContests = async () => {
      const response = await getContests();
      if (response) {
        setContests(response);
      }
    };
    fetchContests();
  }, []);

  return (
    <div>
      <Header loading={loading} user={user} />
      <Container style={{ paddingTop: "1rem" }}>
        <h1>Pick a Contest</h1>
        {!contests.length && <Spinner animation="border" />}
        <ul>
          {contests.map((contest) => (
            <li key={contest._id}>
              <Link to={`/contests/${contest._id}`}>
                <Button>{contest.title}</Button>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
