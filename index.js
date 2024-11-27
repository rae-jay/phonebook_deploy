const express = require("express");
const morgan = require("morgan");

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

let data = [
	{
		id: "1",
		name: "Hornigold",
		number: "222-2222",
	},
	{
		id: "2",
		name: "Bellamy",
		number: "888-8888",
	},
	{
		id: "3",
		name: "Rackham",
		number: "555-5555",
	},
	{
		id: "4",
		name: "Reed",
		number: "444-4444",
	},
];

// utility
const generateId = () => {
	// id really rather guarentee no duplicate ids but the instructions kind of
	// actually imply NOT to do that, so
	return Math.floor(Math.random() * 1000000);
};

// get
app.get("/", (request, response) => {
	response.send("<h1>text</h1>");
});

app.get("/api/persons", (request, response) => {
	response.json(data);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = data.find((entry) => entry.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.get("/info", (request, response) => {
	console.log(request.headers);
	const responseHtml = `<p>Phonebook has info for ${
		data.length
	} people</p><p>${new Date()}</p>`;
	response.send(responseHtml);
});

// post
app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.number) {
		return response.status(400).json({ error: "number is missing" });
	}
	if (!body.name) {
		return response.status(400).json({ error: "name is missing" });
	} else if (data.find((entry) => entry.name === body.name)) {
		return response.status(400).json({ error: "name must be unique" });
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	data = data.concat(person);

	response.json(person);
});

// delete
app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	data = data.filter((entry) => entry.id !== id);

	response.status(204).end();
});

//
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`server running on port ${PORT}`);
