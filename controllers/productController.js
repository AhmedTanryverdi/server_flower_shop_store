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

		Object.entries(req.query).forEach((key, value) => {
			if (!products || !Array.isArray(products)) return;

			if (key === "tag_list") {
				const values = req.query[key].split(",");
				products = products.filter((product) => {
					return product[key].some((tag) => values.includes(tag));
				});
			} else {
				products = products.filter((product) => {
					const productStr =
						JSON.stringify(product).toLocaleLowerCase();
					const terms = req.query[key[0]]
						.toLocaleLowerCase()
						.trim()
						.split(",");

					return terms.some((term) => productStr.includes(term));
				});
			}
		});

		res.status(200).json(products);
	});
}
