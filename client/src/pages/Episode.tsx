import React, { useEffect, useState } from "react";
import { Badge, Button, Container, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getEpisode, postPrediction } from "../gateway";
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

  const [predictionText, setPredictionText] = useState<string>("");

  const fetchEpisode = async () => {
    if (!episodeId) return;
    const response = await getEpisode(episodeId);
    if (response) {
      setEpisode(response);
    }
  };
  useEffect(() => {
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
                <Badge bg="primary">Your prediction:</Badge>
                {category.predictions.filter(
                  (prediction) => prediction.user._id === user?._id
                ).length > 0 ? (
                  category.predictions
                    .filter((prediction) => prediction.user._id === user?._id)
                    .map((prediction) => (
                      <p key={prediction._id}>
                        <UserComponent user={prediction.user} /> -{" "}
                        {prediction.prediction} (
                        {new Date(prediction.createdAt).toLocaleString()})
                      </p>
                    ))
                ) : (
                  <>
                    <p>No prediction yet</p>
                    <input
                      type="text"
                      placeholder="Enter your prediction"
                      value={predictionText}
                      onChange={(e) => setPredictionText(e.target.value)}
                      disabled={!user}
                    />
                    <Button
                      variant="primary"
                      disabled={!user}
                      onClick={() => {
                        postPrediction(category._id, predictionText).then(
                          () => {
                            fetchEpisode();
                          }
                        );
                      }}
                    >
                      Submit
                    </Button>
                  </>
                )}
                <br />
                <Badge bg="secondary">Other predictions:</Badge>
                {category.predictions
                  .filter((prediction) => prediction.user._id !== user?._id)
                  .map((prediction) => (
                    <p key={prediction._id}>
                      <UserComponent user={prediction.user} /> -{" "}
                      {prediction.prediction} (
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

function UserComponent({ user }: { user: IUser }) {
  return (
    <>
      <Image
        src={user.avatar}
        alt={user.username}
        roundedCircle
        height="30"
        width="30"
      />
      <span>{user.username}</span>
    </>
  );
}
