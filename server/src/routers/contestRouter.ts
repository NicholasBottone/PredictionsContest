import { Router } from "express";
import Episode from "../models/Episode";
import Contest from "../models/Contest";
import Category from "../models/Category";
import { IUser } from "../models/User";
import Prediction from "../models/Prediction";
import { body, param, validationResult } from "express-validator";

const contestRouter = Router();

// GET all contests
contestRouter.get("/", async (_req, res) => {
  const contests = await Contest.find();
  res.send(contests);
});

// GET episode by id
contestRouter.get("/episode/:id", param("id").isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.params) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const episode = await Episode.findById(req.params.id)
    .populate("categories")
    .populate({
      path: "categories",
      populate: {
        path: "predictions",
        populate: {
          path: "user",
        },
      },
    });
  res.send(episode);
});

// GET contest by id
contestRouter.get("/:id", param("id").isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.params) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const contest = await Contest.findById(req.params.id).populate("episodes");
  res.send(contest);
});

// POST prediction
contestRouter.post(
  "/prediction/:id",
  param("id").isMongoId(),
  body("prediction").isString(),
  async (req, res) => {
    if (!req.user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params || !req.body) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = req.user as IUser;
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).send("Category not found");
      return;
    }

    // Check if category is already due or if result has been released
    if (
      (category.dueDate && new Date(category.dueDate) < new Date()) ||
      category.correctPrediction
    ) {
      res.status(400).send("Too late to submit this prediction now");
      return;
    }

    // Check if user has already made a prediction for this category
    const existingPrediction = await Prediction.findOne({
      user: user._id,
      category: category._id,
    });
    if (existingPrediction) {
      res
        .status(400)
        .send("You have already made a prediction for this category");
      return;
    }

    const prediction = new Prediction({
      user: user._id,
      category: category._id,
      prediction: req.body.prediction,
    });
    await prediction.save();
    category.predictions.push(prediction._id);
    await category.save();
    res.send(prediction);
  }
);

// POST new contest
contestRouter.post("/", body("title").isString(), async (req, res) => {
  if (!req.user || !(req.user as IUser).admin) {
    res.status(401).send("Unauthorized");
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.body) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const contest = new Contest({
    title: req.body.title,
  });
  await contest.save();
  res.send(contest);
});

// POST new category to episode
contestRouter.post(
  "/episode/:id/category",
  param("id").isMongoId(),
  body("title").isString(),
  async (req, res) => {
    if (!req.user || !(req.user as IUser).admin) {
      res.status(401).send("Unauthorized");
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.body || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      res.status(404).json({ errors: [{ msg: "Episode not found" }] });
      return;
    }

    const category = new Category({
      title: req.body.title,
      episode: episode._id,
    });
    await category.save();
    episode.categories.push(category);
    await episode.save();
    res.send(category);
  }
);

// POST new episode to contest
contestRouter.post(
  "/:id/episode",
  param("id").isMongoId(),
  body("title").isString(),
  async (req, res) => {
    if (!req.user || !(req.user as IUser).admin) {
      res.status(401).send("Unauthorized");
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.body || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      res.status(404).json({ errors: [{ msg: "Contest not found" }] });
      return;
    }

    const episode = new Episode({
      title: req.body.title,
      contest: contest._id,
    });
    await episode.save();
    contest.episodes.push(episode);
    await contest.save();
    res.send(episode);
  }
);

// PUT update category
contestRouter.put(
  "/category/:id",
  param("id").isMongoId(),
  body("title").optional().isString(),
  body("correctPrediction").optional().isString(),
  body("dueDate").optional().isString(),
  async (req, res) => {
    if (!req.user || !(req.user as IUser).admin) {
      res.status(401).send("Unauthorized");
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.body || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ errors: [{ msg: "Category not found" }] });
      return;
    }

    if (req.body.title) {
      category.title = req.body.title;
    }
    if (req.body.correctPrediction) {
      category.correctPrediction = req.body.correctPrediction;
    }
    if (req.body.dueDate) {
      //check if dueDate is a valid date
      const date = new Date(req.body.dueDate);
      if (isNaN(date.getTime())) {
        res.status(400).json({ errors: [{ msg: "Invalid date" }] });
        return;
      }
      category.dueDate = date;
    } else {
      category.dueDate = undefined;
    }
    await category.save();
    res.send(category);
  }
);

// PUT update episode
contestRouter.put(
  "/episode/:id",
  param("id").isMongoId(),
  body("title").optional().isString(),
  body("image").optional().isString(),
  async (req, res) => {
    if (!req.user || !(req.user as IUser).admin) {
      res.status(401).send("Unauthorized");
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.body || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      res.status(404).json({ errors: [{ msg: "Episode not found" }] });
      return;
    }

    if (req.body.title) {
      episode.title = req.body.title;
    }
    if (req.body.image) {
      episode.image = req.body.image;
    }
    await episode.save();
    res.send(episode);
  }
);

export default contestRouter;
