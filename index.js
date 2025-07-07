import express from "express";
import cors from "cors";
import { getOneProduct, getProducts } from "./controllers/productController.js";
import { addReviews } from "./controllers/reviewsController.js";

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

app.use("/catalog", express.static("uploads"));

app.get("/catalog/:id", getOneProduct);

app.get("/catalog", getProducts);

app.post("/send-reviews", addReviews);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
