const express = require("express");
import { CreateTrackController, GetTrackController } from "./track_controllers";

const router = express.Router()

router
  .route("/")
  .post(CreateTrackController)
  .get(GetTrackController);

module.exports = router;
