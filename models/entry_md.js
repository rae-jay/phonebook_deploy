const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGO_URL;

mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB: ", error.message);
	});

const entrySchema = new mongoose.Schema({
	name: { type: String, required: true, minLength: 3 },
	number: {
		type: String,
		required: true,
		validate: {
			validator: (v) => {
				// k i dunno if 'length of 8' meant with or without the '-'
				return /^(?=^.{8,}$)(^\d{2,3}-\d+$)$/.test(v);
			},
			message: (props) => `${props.value} is not a valid phone number`,
		},
	},
});
entrySchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Entry", entrySchema);
