document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available. Add a new quote!";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><strong>Category:</strong> ${quote.category}</p>`;
        sessionStorage.setItem("lastQuote", JSON.stringify(quote));
    }

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes();
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
            showRandomQuote();
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.id = "quoteFormContainer";

        const quoteInput = document.createElement("input");
        quoteInput.id = "newQuoteText";
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter a new quote";

        const categoryInput = document.createElement("input");
        categoryInput.id = "newQuoteCategory";
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter quote category";

        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";
        addButton.addEventListener("click", addQuote);

        const exportButton = document.createElement("button");
        exportButton.textContent = "Export Quotes";
        exportButton.addEventListener("click", exportQuotes);
        
        const importInput = document.createElement("input");
        importInput.type = "file";
        importInput.accept = ".json";
        importInput.addEventListener("change", importFromJsonFile);

        formContainer.appendChild(quoteInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(addButton);
        formContainer.appendChild(exportButton);
        formContainer.appendChild(importInput);
        document.body.appendChild(formContainer);
    }

    function exportQuotes() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    alert("Quotes imported successfully!");
                    showRandomQuote();
                } else {
                    alert("Invalid file format.");
                }
            } catch (error) {
                alert("Error reading file.");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    newQuoteButton.addEventListener("click", showRandomQuote);
    createAddQuoteForm();
    showRandomQuote();
});
