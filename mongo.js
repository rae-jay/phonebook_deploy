// being replaced i think in models/person_md??

// const cmdLen = process.argv.length;

// if (cmdLen < 3) {
// 	console.log("provide password as argument");
// } else if (cmdLen != 3 && cmdLen < 5) {
// 	console.log("provide both name and number");
// } else {
// 	//

// 	const password = process.argv[2];
// 	const url = `mongodb+srv://galadaeoakbreeze:${password}@cluster0.aalqx.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`;

// 	mongoose.set("strictQuery", false);
// 	mongoose.connect(url);

// 	const entrySchema = new mongoose.Schema({
// 		name: String,
// 		number: String,
// 	});
// 	const Entry = mongoose.model("Entry", entrySchema);

// 	//
// 	if (process.argv.length === 3) {
// 		// search all, not add
// 		console.log("phonebook:");

// 		Entry.find({}).then((result) => {
// 			result.forEach((entry) => {
// 				console.log(`${entry.name} / ${entry.number}`);
// 			});
// 			mongoose.connection.close();
// 		});
// 	} else {
// 		// add

// 		const name = process.argv[3];
// 		const number = process.argv[4];

// 		const newEntry = new Entry({
// 			name: name,
// 			number: number,
// 		});

// 		newEntry.save().then((result) => {
// 			console.log(`added ${name} / ${number} to the phonebook`);
// 			mongoose.connection.close();
// 		});
// 	}
// }

// const testE = new TestE({
// 	content: "example",
// });

// testE.save().then((result) => {
// 	console.log("saved");
// 	mongoose.connection.close();
// });
