import fs from "fs";
import path from "path";

const filePath = path.join(path.resolve(), "/database/db.json");

export function getProducts(req, res) {
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

		if (!products || !Array.isArray(products)) return;

		const filteredProducts = products.filter((product) => {
			let validProduct = true;
			for (let [key, value] of Object.entries(req.query)) {
				switch (key) {
					case "price_min":
						if (Number(product.price) < Number(value)) return false;
						break;
					case "price_max":
						if (Number(product.price) > Number(value)) return false;
						break;
					case "tags":
						if (value !== "undefined") {
							const tags = value.split(",");
							validProduct = product.tag_list.some((tag) =>
								tags.includes(tag)
							);
						}
						break;
					default:
						const productStr =
							JSON.stringify(product).toLocaleLowerCase();
						const terms = req.query[key]
							.toLocaleLowerCase()
							.trim()
							.split(",");
						validProduct = terms.some((term) =>
							productStr.includes(term)
						);
				}
			}
			return validProduct;
		});
		res.status(200).json(filteredProducts);
	});
}

export function getOneProduct(req, res) {
	const productId = parseInt(req.params.id);
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			return res.status(500).send("Error reading the file.");
		}

		try {
			const products = JSON.parse(data);
			const product = products.find(
				(item) => parseInt(item.id) === productId
			);
			return res.status(200).json(product);
		} catch (error) {
			return res.status(500).send("Invalid JSON format in the file.");
		}
	});
}
