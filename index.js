import express from "express";
import cors from "cors";
import { getProducts } from "./controllers/productController.js";

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
	})
);
app.use("/catalog", express.static("uploads"));

app.get("/catalog", getProducts);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
