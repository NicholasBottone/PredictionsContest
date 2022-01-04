import React, { useState } from "react";
import { Button, Container, Row, Col, Badge } from "react-bootstrap";
import Header from "../components/Header";
import {
  getContest,
  getContests,
  getEpisode,
  postContest,
  postCategory,
  postEpisode,
  putCategory,
  putEpisode,
} from "../gateway";
import { ICategory, IContest, IEpisode, IUser } from "../types";

interface AdminProps {
  loading: boolean;
  user: IUser | undefined;
}

export default function Admin({ loading, user }: AdminProps) {
  const [contests, setContests] = useState<IContest[]>([]);
  const [episodes, setEpisodes] = useState<IEpisode[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [contestId, setContestId] = useState<string>("");
  const [episodeId, setEpisodeId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [correctPrediction, setCorrectPrediction] = useState<string>("");

  const fetchContests = async () => {
    const response = await getContests();
    if (response) {
      console.log(response);
      setContests(response);
    }
  };

  const fetchEpisodes = async (queryContestId: string) => {
    const response = await getContest(queryContestId);
    if (response) {
      console.log(response);
      setEpisodes(response.episodes);
    }
  };

  const fetchCategories = async (queryEpisodeId: string) => {
    const response = await getEpisode(queryEpisodeId);
    if (response) {
      console.log(response);
      setCategories(response.categories);
    }
  };

  return (
    <div>
      <Header loading={loading} user={user} />
      <Container style={{ paddingTop: "1rem" }}>
        <h1>Admin Panel</h1>
        <Row style={{ margin: "1rem" }}>
          {!user?.admin && <Badge bg="danger">You aren't an admin 😡</Badge>}
        </Row>
        <Button variant="primary" onClick={() => fetchContests()}>
          Get Contests
        </Button>
        <Button
          variant="primary"
          onClick={() => fetchEpisodes(contestId)}
          disabled={!contestId}
        >
          Get Episodes
        </Button>
        <Button
          variant="primary"
          onClick={() => fetchCategories(episodeId)}
          disabled={!episodeId}
        >
          Get Categories
        </Button>
        <Button
          variant="secondary"
          onClick={() => postContest(title).then(() => fetchContests())}
          disabled={!title || !user?.admin}
        >
          Create Contest
        </Button>
        <Button
          variant="secondary"
          onClick={() => postEpisode(contestId, title)}
          disabled={!contestId || !title || !user?.admin}
        >
          Create Episode
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            postCategory(episodeId, title).then(() =>
              fetchCategories(episodeId)
            )
          }
          disabled={!episodeId || !title || !user?.admin}
        >
          Create Category
        </Button>
        <Button
          variant="info"
          onClick={() => putEpisode(episodeId, title, image)}
          disabled={!episodeId || !user?.admin}
        >
          Update Episode
        </Button>
        <Button
          variant="info"
          onClick={() =>
            putCategory(
              categoryId,
              title,
              correctPrediction,
              dueDate ? new Date(dueDate).toISOString() : undefined
            )
          }
          disabled={!categoryId || !user?.admin}
        >
          Update Category
        </Button>
        <Row style={{ marginTop: "1rem" }}>
          <input
            type="text"
            value={contestId}
            onChange={(e) => setContestId(e.target.value)}
            placeholder="Contest ID"
          />
          <input
            type="text"
            value={episodeId}
            onChange={(e) => setEpisodeId(e.target.value)}
            placeholder="Episode ID"
          />
          <input
            type="text"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Category ID"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />
          <input
            type="text"
            value={correctPrediction}
            onChange={(e) => setCorrectPrediction(e.target.value)}
            placeholder="Correct Prediction"
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) =>
              e.target.value ? setDueDate(e.target.value) : setDueDate("")
            }
            placeholder="Due Date"
          />
        </Row>
        <Row style={{ marginTop: "1rem" }}>
          <Col>
            <h2>Contests</h2>
            {contests.map((contest) => (
              <div key={contest._id}>
                <h4>{contest.title}</h4>
                <p>{contest._id}</p>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => fetchEpisodes(contest._id)}
                >
                  Get Episodes
                </Button>
              </div>
            ))}
          </Col>
          <Col>
            <h2>Episodes</h2>
            {episodes.map((episode) => (
              <div key={episode._id}>
                <h4>{episode.title}</h4>
                <p>{episode._id}</p>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => fetchCategories(episode._id)}
                >
                  Get Categories
                </Button>
              </div>
            ))}
          </Col>
          <Col>
            <h2>Categories</h2>
            {categories.map((category) => (
              <div key={category._id}>
                <h4>{category.title}</h4>
                <p>
                  {category._id}
                  <br />
                  Due: {category.dueDate}
                  <br />
                  Correct Prediction: {category.correctPrediction}
                </p>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
