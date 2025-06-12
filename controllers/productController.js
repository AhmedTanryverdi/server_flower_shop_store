import fs from "fs";
import path from "path";

export function getProducts(req, res) {
	const filePath = path.join(path.resolve(), "/database/db.json");

	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			return res.status(500).send("Error reading the file.");
		}

		let products;
		try {
			products = JSON.parse(data);
		} catch (parseErr) {
			return res.status(500).send("Invalid JSON format in the file.");
		}

		res.status(200).json(products);
	});
}
