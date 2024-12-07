const express = require("express");
const morgan = require("morgan");

require("dotenv").config();
const Entry = require("./models/entry_md");

const app = express();
app.use(express.json());
app.use(express.static("dist"));

morgan.token("content", function (req, res) {
	// don't love the hanging '-' that shows up when return = null
	// but you did specifically ask for data sent in *POST* requests, so
	return req.method == "POST" ? JSON.stringify(req.body) : null;
});
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :content"
	)
);

// get
app.get("/", (request, response) => {
	response.send("<h1>text</h1>");
});

app.get("/api/persons", (request, response) => {
	Entry.find({}).then((data) => {
		response.json(data);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	Entry.findById(request.params.id)
		.then((entry) => {
			if (entry) {
				response.json(entry);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.get("/info", (request, response) => {
	// console.log(request.headers);
	Entry.find({}).then((data) => {
		const responseHtml = `<p>Phonebook has info for ${
			data.length
		} people</p><p>${new Date()}</p>`;
		response.send(responseHtml);
	});
});

// post
app.post("/api/persons", (request, response, next) => {
	const body = request.body;

	// if (!body.number) {
	// 	return response.status(400).json({ error: "number is missing" });
	// }
	// if (!body.name) {
	// 	return response.status(400).json({ error: "name is missing" });
	// }

	const entry = new Entry({
		name: body.name,
		number: body.number,
	});

	entry
		.save()
		.then((saved) => {
			response.json(saved);
		})
		.catch((error) => next(error));
});

// put
app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;

	Entry.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedEntry) => {
			response.json(updatedEntry);
		})
		.catch((error) => next(error));
});

// delete
app.delete("/api/persons/:id", (request, response, next) => {
	Entry.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));

	// const id = request.params.id;
	// data = data.filter((entry) => entry.id !== id);

	// response.status(204).end();
});

//
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`server running on port ${PORT}`);

// this apparently has to go after all other middleware AND routes
// which looks *messy*
const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).send({ error: error.message });
	}

	next(error);
};
app.use(errorHandler);
