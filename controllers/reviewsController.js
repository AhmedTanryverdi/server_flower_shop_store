import path from "path";
import fs from "node:fs/promises";

const reviewsDbPath = path.join(path.resolve(), "/database/reviewsdb.json");

async function loadReviewsFromFile() {
	try {
		const fileContent = await fs.readFile(reviewsDbPath, "utf8");
		return JSON.parse(fileContent);
	} catch (err) {
		console.error("Ошибка при чтении файла:", err.message);
		throw err;
	}
}

async function saveReviewsToFile(reviews) {
	try {
		await fs.writeFile(reviewsDbPath, JSON.stringify(reviews, null, 2));
	} catch (err) {
		console.error("Ошибка при сохранении файла:", err.message);
		throw err;
	}
}

export async function addReviews(req, res) {
	try {
		const { username, email, review } = req.body;

		if (!username || !email || !review) {
			return res.status(400).json({ error: "Заполните все поля!" });
		}

		const currentReviews = await loadReviewsFromFile();

		console.log("reviews: ", currentReviews);

		const newId = Date.now().toString();

		const newReview = {
			id: newId,
			username,
			email,
			review,
		};

		currentReviews.push(newReview);

		await saveReviewsToFile(currentReviews);

		res.status(200).json({
			success: true,
			message: "Отзывы успешно отправлены!",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			error: "Что-то пошло не так.",
			details: err.message,
		});
	}
}
