import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getEpisode } from "../gateway";
import { IEpisode, IUser } from "../types";

interface EpisodeProps {
  loading: boolean;
  user: IUser | undefined;
}

type EpisodeParams = {
  contestId: string;
  episodeId: string;
};

export default function Episode({ loading, user }: EpisodeProps) {
  const [episode, setEpisode] = useState<IEpisode | undefined>(undefined);
  const { episodeId } = useParams<EpisodeParams>();

  useEffect(() => {
    const fetchEpisode = async () => {
      if (!episodeId) return;
      const response = await getEpisode(episodeId);
      if (response) {
        setEpisode(response);
      }
    };
    fetchEpisode();
  }, [episodeId]);

  return (
    <div>
      <Header loading={loading} user={user} />
      <Container style={{ paddingTop: "1rem" }}>
        <h1>{episode?.title}</h1>
        <h2>Make your predictions!</h2>
        <ul>
          {episode &&
            episode.categories.map((category) => (
              <li key={category._id}>
                <p>
                  <strong>{category.title}</strong>
                </p>
                {category.dueDate && (
                  <p>Due: {new Date(category.dueDate).toLocaleString()}</p>
                )}
                {category.correctPrediction && (
                  <p>Result: {category.correctPrediction}</p>
                )}
                {category.predictions.map((prediction) => (
                  <p key={prediction._id}>
                    {prediction.user} - {prediction.prediction} (
                    {new Date(prediction.createdAt).toLocaleString()})
                  </p>
                ))}
              </li>
            ))}
        </ul>
      </Container>
    </div>
  );
}
