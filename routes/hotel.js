import express from "express";
import formidable from "express-formidable";
import {
  create,
  hotels,
  image,
  sellerHotels,
  remove,
  read,
  update,
} from "../controllers/hotel";
import { hotelOwner, requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create-hotel", requireSignin, formidable(), create);
router.get("/hotels", hotels);
router.get("/hotel/image/:hotelId", image);
router.get("/seller-hotels", requireSignin, sellerHotels);
router.delete("/delete-hotel/:hotelId", requireSignin, hotelOwner, remove);
router.get("/hotel/:hotelId", read);
router.put(
  "/update-hotel/:hotelId",
  requireSignin,
  hotelOwner,
  formidable(),
  update
);

module.exports = router;
