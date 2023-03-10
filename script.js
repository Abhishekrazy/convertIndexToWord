function handleChange() {
	let input = document.getElementById("index-input");
	input.setAttribute("value", input.value);
}

function convertIndexToWord() {
	let indexString = document.getElementById("index-input").value.trim();
	indexString = indexString.replaceAll(",", " ");
	const alphabet = "abcdefghijklmnopqrstuvwxyz";
	console.log("indexString: ", indexString);
	if (indexString) {
		let indexArray = indexString.trim().split(/[.\s]+/);
		let wordArray = [];
		let finalWord = "";

		indexArray.forEach((index) => {
			console.log("index: ", index);
			const i = parseInt(index.trim()) - 1;
			if (i <= 26) {
				const word = alphabet.charAt(i);
				wordArray.push(word);
				finalWord = wordArray.join("");
			} else {
				let errorText = document.getElementById("errorText");
				// Display an error message
				errorText.innerHTML = "Not a valid index";
			}
		});
		if (finalWord != "Not a valid index") {
			wordArray = capitalizeFirstLetter(finalWord);
			if (finalWord) {
				lookforthisword(finalWord);
			}
		}
		document.getElementById("result").innerHTML = finalWord;
	}
}
function letterToIndex() {
	let input = document.getElementById("index-input").value;
	input = input.replace(" ", "").trim();
	if (input) {
		lookforthisword(input);
		// Split the input string by space into an array of words
		const words = input.split("");
		// Array to store the index of each word
		const indices = [];
		// Loop through each word, convert it to index, and push to indices array
		words.forEach((word) => {
			// Convert the word to lowercase
			const lowercaseWord = word.toLowerCase();
			// Get the ASCII code of the first character of the word
			const asciiCode = lowercaseWord.charCodeAt(0);
			// Subtract the ASCII code of 'a' to get the index (0-25)
			const index = asciiCode - 96;
			indices.push(index);
		});

		// Join the indices array into a string separated by space
		const result = indices.join(" ");

		// Display the result in the result element
		document.getElementById("result").innerHTML = result;
	}
}
function capitalizeFirstLetter(str) {
	return str.toString().charAt(0).toUpperCase() + str.toString().slice(1);
}
function lookforthisword(str) {
	const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + str; //encodeURIComponent();
	// Make a GET request to the API
	const responseElement = document.getElementById("responsetext");
	fetch(apiUrl)
		.then((response) => {
			if (response.status === 404) {
				return response.json().then((error) => {
					responseElement.innerHTML = `
							<p style="text-align:center;">${error.title}</p>
							<p style="text-align:center;">${error.message}</p>
							<p style="text-align:center;">${error.resolution}</p>
							`;
				});
			} else {
				return response.json();
			}
		})
		.then((data) => {
			// Format the response as a string
			const formattedResponse = JSON.stringify(data, null, 2);
			const myDiv = document.getElementById("my-audio");
			myDiv.innerHTML = "";
			for (let key of data) {
				for (let phoetics of key.phonetics) {
					if (phoetics.audio) {
						const div = document.createElement("div");
						div.setAttribute(
							"style",
							"flex-direction: column; display: flex; flex-wrap: wrap; justify-content: center; align-items: center;"
						);
						// create the audio element
						const audio = document.createElement("audio");
						audio.setAttribute("style", "padding: 10px;");
						audio.controls = true;
						// create the source element and set its attributes
						const source = document.createElement("source");
						source.src = phoetics.audio;
						source.type = "audio/mpeg";
						if (phoetics.license) {
							if (phoetics.license.name) {
								audio.setAttribute("title", phoetics.license.name);
							}
						}
						// append the source element to the audio element
						audio.appendChild(source);

						const a = document.createElement("a");
						a.href = phoetics.sourceUrl;
						a.setAttribute(
							"style",
							"font: caption; text-decoration: none;    color: blueviolet;"
						);
						a.setAttribute("id", "url");
						a.textContent = "Source Url";

						div.appendChild(audio);
						div.appendChild(a);
						// append the audio element to the div
						myDiv.appendChild(div);
					}
				}
				const meaningdiv = document.createElement("div");
				meaningdiv.id = "meaningdiv";
				for (let meaning of key.meanings) {
					const p = document.createElement("p");
					p.setAttribute(
						"style",
						"text-align:left;font-size:12px; text-decoration: none;"
					);
					p.innerText = "Part Of Speech: " + meaning.partOfSpeech;
					p.className = "tag";
					meaningdiv.appendChild(p);
					for (let definition in meaning.definitions) {
						const definitionP = document.createElement("p");
						definitionP.innerText =
							"Definition: " + meaning.definitions[definition].definition;
						meaningdiv.appendChild(definitionP);
						if (meaning.definitions[definition].example) {
							const exampleP = document.createElement("p");
							exampleP.innerText =
								"Example: " + meaning.definitions[definition].example;
							meaningdiv.appendChild(exampleP);
						}
						if (definition.synonyms) {
							const synonymsP = document.createElement("p");
							synonymsP.innerText = "synonyms: ";
							for (let synonyms of definition.synonyms) {
								const synonymsChip = document.createElement("p");
								synonymsChip.innerText = synonyms;
								synonymsChip.className = "tag";
								synonymsChip.setAttribute(
									"style",
									"text-align:left;font-size:8px; font-wight:400; text-decoration: none;"
								);
								synonymsP.appendChild(synonymsChip);
							}
							meaningdiv.appendChild(synonymsP);
						}
						if (definition.antonyms) {
							const antonymsP = document.createElement("p");
							antonymsP.innerText =
								"antonyms: " + meaning.definitions[antonyms];
							for (let antonyms of definition.antonyms) {
								const synonymsChip = document.createElement("p");
								synonymsChip.innerText = synonyms;
								synonymsChip.className = "tag";
								synonymsChip.setAttribute(
									"style",
									"text-align:left;font-size:8px; font-wight:400; text-decoration: none;"
								);
								antonymsP.appendChild(synonymsChip);
							}
							meaningdiv.appendChild(antonymsP);
						}
					}
					if (meaning.synonyms) {
						const synonymsP = document.createElement("p");
						synonymsP.innerText = "synonyms: ";
						for (let synonyms of meaning.synonyms) {
							const synonymsChip = document.createElement("p");
							synonymsChip.innerText = synonyms;
							synonymsChip.className = "tag";
							synonymsChip.setAttribute(
								"style",
								"text-align:left;font-size:8px; font-wight:400; text-decoration: none;"
							);
							synonymsP.appendChild(synonymsChip);
						}
						meaningdiv.appendChild(synonymsP);
					}
				}
				for (let sourceUrl in key.sourceUrls) {
					const a = document.createElement("a");
					a.setAttribute(
						"style",
						"text-align:center;font-size:12px; text-decoration: none;"
					);
					a.setAttribute("href", key.sourceUrls[sourceUrl]);
					a.innerText = "Source";
					meaningdiv.appendChild(a);
				}
				responseElement.appendChild(meaningdiv);
			}
			// Display the response in a <pre> element
			//responseElement.innerHTML = `<p style="text-align:center;">${formattedResponse}</p>`;
		})
		.catch((error) => {
			return console.error("Error:", error);
		});
}
// Set the default function to letterToIndex()
function toggleFunction() {
	// Get the toggle switch and the button elements
	const toggle = document.getElementById("checkbox");
	const heading = document.getElementById("heading");
	const divText = document.getElementById("index-input");
	let helpText = document.getElementById("helptext");

	if (toggle.checked) {
		toggle.title = "Check if you want convert Index to Letter";
		heading.innerText = "Convert Index to Letter";
		divText.pattern = "^(0?[1-9]|[1-9][0-9])s?(0?[1-9]|[1-2][0-6])?$";
		divText.placeholder = "Enter Indexes";
		helpText.innerText = "Enter Indexes of the Letters";
	} else {
		toggle.title = "Check if you want convert Letter to Index";
		heading.innerText = "Convert Letter to Index";
		divText.pattern = "/[^a-zA-Z]+/g";
		divText.placeholder = "Enter Text";
		helpText.innerText = "Enter word without space";
	}
}

function validateForm() {
	event.preventDefault();
	// Get the input field
	const input = document.getElementById("index-input");
	let errorText = document.getElementById("errorText");
	// Check if the input field is empty
	if (input.value === "") {
		// Display an error message
		errorText.innerHTML = "Please enter a value";
	} else {
		errorText.innerHTML = "";
		const toggle = document.getElementById("checkbox");
		if (toggle.checked) {
			convertIndexToWord();
		} else {
			letterToIndex();
		}
	}
}
