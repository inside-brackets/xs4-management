import express from "express";
import { generateUploadURL, deleteUploadedURL } from "../controllers/s3.js";

const router = express.Router();

router.get("/s3url/:folder/:fileName/:del?", async (req, res) => {
  const url = await generateUploadURL(
    req.params.folder,
    req.params.fileName,
    req.params.del
  );
  res.send(url);
});
router.get("/s3url-delete/:folder/:fileName", async (req, res) => {
  const response = await deleteUploadedURL(
    req.params.folder,
    req.params.fileName
  );
  res.send(response);
});
router.delete("/s3url-delete/:folder/:fileName", async (req, res) => {
  const response = await deleteUploadedURL(
    req.params.folder,
    req.params.fileName
  );
  res.send(response);
});

export default router;
