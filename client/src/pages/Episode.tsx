import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getEpisode, postPrediction } from "../gateway";
import { ICategory, IEpisode, IPrediction, IUser } from "../types";

interface EpisodeProps {
  loading: boolean;
  user: IUser | undefined;
}

type EpisodeParams = {
  contestId: string;
  episodeId: string;
};

async function fetchEpisode(episodeId?: string): Promise<IEpisode | undefined> {
  if (!episodeId) return;
  return getEpisode(episodeId);
}

export default function Episode({ loading, user }: EpisodeProps) {
  const [episode, setEpisode] = useState<IEpisode | undefined>(undefined);
  const { episodeId } = useParams<EpisodeParams>();

  const [predictionText, setPredictionText] = useState<string>("");

  useEffect(() => {
    fetchEpisode(episodeId).then((response) => {
      if (response) {
        setEpisode(response);
      }
    });
  }, [episodeId]);

  // Calculate the episode leaderboard rankings
  const leaderboard: { [id: string]: { user: IUser; score: number } } = {};
  if (episode) {
    episode.categories.forEach((category) => {
      category.predictions.forEach((prediction) => {
        if (!leaderboard[prediction.user._id]) {
          leaderboard[prediction.user._id] = {
            user: prediction.user,
            score: 0,
          };
        }
        if (prediction.prediction === category.correctPrediction) {
          leaderboard[prediction.user._id].score += 1;
        }
      });
    });
  }

  const sortedLeaderboard = Object.values(leaderboard).sort(
    (a, b) => b.score - a.score
  );

  return (
    <div>
      <Header loading={loading} user={user} />
      <Container style={{ paddingTop: "1rem" }}>
        <h1>{episode?.title}</h1>
        <Image src={episode?.image} fluid alt={episode?.title} />
        <h2>Make your predictions!</h2>
        {!episode && <Spinner animation="border" />}
        <Row xs={1} lg={2}>
          {episode &&
            episode.categories.map((category) => (
              <Col key={category._id}>
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
                      <PredictionComponent
                        key={prediction._id}
                        prediction={prediction}
                        category={category}
                      />
                    ))
                ) : (
                  <SubmitPredictionComponent
                    predictionText={predictionText}
                    setPredictionText={setPredictionText}
                    user={user}
                    category={category}
                    episodeId={episodeId}
                    setEpisode={setEpisode}
                  />
                )}
                <br />
                <Badge bg="secondary">Other predictions:</Badge>
                {category.predictions
                  .filter((prediction) => prediction.user._id !== user?._id)
                  .map((prediction) => (
                    <PredictionComponent
                      key={prediction._id}
                      prediction={prediction}
                      category={category}
                    />
                  ))}
                <hr />
              </Col>
            ))}
        </Row>
        <h2>Episode Leaderboard</h2>
        <ol>
          {sortedLeaderboard.map((entry) => (
            <li key={entry.user._id}>
              <p>
                <UserComponent user={entry.user} /> - Score: {entry.score}
              </p>
            </li>
          ))}
        </ol>
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
      <strong> {user.username}</strong>
    </>
  );
}

function PredictionComponent({
  prediction,
  category,
}: {
  prediction: IPrediction;
  category: ICategory;
}) {
  const correct = prediction.prediction === category.correctPrediction;
  const CorrectBadge = () =>
    correct ? <Badge bg="success">✔</Badge> : <Badge bg="danger">❌</Badge>;

  return (
    <p>
      {category.correctPrediction && <CorrectBadge />}
      <UserComponent user={prediction.user} /> - {prediction.prediction} (
      {new Date(prediction.createdAt).toLocaleString()})
    </p>
  );
}

function SubmitPredictionComponent({
  predictionText,
  setPredictionText,
  user,
  category,
  episodeId,
  setEpisode,
}: {
  predictionText: string;
  setPredictionText: (text: string) => void;
  user?: IUser;
  category: ICategory;
  episodeId?: string;
  setEpisode: (episode: IEpisode) => void;
}) {
  if (
    (category.dueDate && new Date(category.dueDate) < new Date()) ||
    category.correctPrediction
  ) {
    return <p>You missed the deadline for this category.</p>;
  }

  return (
    <>
      <p>No prediction yet</p>
      {category.title.split(" vs ").length === 2 && (
        <>
          <Button
            variant="danger"
            onClick={() => setPredictionText(category.title.split(" vs ")[0])}
          >
            {category.title.split(" vs ")[0]}
          </Button>
          <Button
            variant="primary"
            onClick={() => setPredictionText(category.title.split(" vs ")[1])}
          >
            {category.title.split(" vs ")[1]}
          </Button>
        </>
      )}
      <input
        type="text"
        placeholder="Enter your prediction"
        value={predictionText}
        onChange={(e) => setPredictionText(e.target.value)}
      />
      <Button
        variant="success"
        disabled={!user || !predictionText}
        onClick={() => {
          postPrediction(category._id, predictionText).then(() => {
            fetchEpisode(episodeId).then((response) => {
              if (response) {
                setEpisode(response);
              }
            });
          });
        }}
      >
        Submit
      </Button>
    </>
  );
}
