import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getContest } from "../gateway";
import { IContest, IUser } from "../types";

interface ContestProps {
  loading: boolean;
  user: IUser | undefined;
}

type ContestParams = {
  contestId: string;
};

export default function Contest({ loading, user }: ContestProps) {
  const [contest, setContest] = useState<IContest | undefined>(undefined);
  const { contestId } = useParams<ContestParams>();

  useEffect(() => {
    const fetchContest = async () => {
      if (!contestId) return;
      const response = await getContest(contestId);
      if (response) {
        setContest(response);
      }
    };
    fetchContest();
  }, [contestId]);

  return (
    <div>
      <Header loading={loading} user={user} />
      <Container style={{ paddingTop: "1rem" }}>
        <h1>{contest?.title}</h1>
        <h2>Pick an Episode</h2>
        <ul>
          {contest &&
            contest.episodes.map((episode) => (
              <li key={episode._id}>
                <Link to={`/contests/${contestId}/episodes/${episode._id}`}>
                  <Button>{episode.title}</Button>
                </Link>
              </li>
            ))}
        </ul>
      </Container>
    </div>
  );
}
