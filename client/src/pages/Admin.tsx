import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import {
  getContest,
  getContests,
  getEpisode,
  postContest,
  postCategory,
  postEpisode,
  putCategory,
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
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [correctPrediction, setCorrectPrediction] = useState<string>("");

  const fetchContests = async () => {
    const response = await getContests();
    if (response) {
      setContests(response);
    }
  };

  const fetchEpisodes = async (queryContestId: string) => {
    const response = await getContest(queryContestId);
    if (response) {
      setEpisodes(response);
    }
  };

  const fetchCategories = async (queryEpisodeId: string) => {
    const response = await getEpisode(queryEpisodeId);
    if (response) {
      setCategories(response);
    }
  };

  return (
    <div>
      <Header loading={loading} user={user} />
      <Container style={{ paddingTop: "1rem" }}>
        <h1 style={{ marginBottom: "1rem" }}>Admin Panel</h1>
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
          onClick={() =>
            postEpisode(contestId, title).then(() => fetchEpisodes(contestId))
          }
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
          onClick={() =>
            putCategory(categoryId, title, correctPrediction, dueDate).then(
              () => fetchCategories(episodeId)
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
            value={correctPrediction}
            onChange={(e) => setCorrectPrediction(e.target.value)}
            placeholder="Correct Prediction"
          />
          <input
            type="datetime-local"
            value={dueDate.toISOString().substring(0, 16)}
            onChange={(e) => setDueDate(new Date(e.target.value))}
            placeholder="Due Date"
          />
        </Row>
        <Row style={{ marginTop: "1rem" }}>
          <Col>
            <h2>Contests</h2>
            {contests.map((contest) => (
              <div key={contest._id}>
                <h3>{contest.title}</h3>
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
                <h3>{episode.title}</h3>
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
                <h3>{category.title}</h3>
                <p>{category._id}</p>
                <p>Due: {category.dueDate}</p>
                <p>Correct Prediction: {category.correctPrediction}</p>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() =>
                    putCategory(
                      category._id,
                      category.title,
                      category.correctPrediction,
                      category.dueDate
                    )
                  }
                >
                  Update Category
                </Button>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
