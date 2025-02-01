document.addEventListener("DOMContentLoaded", () => {
    // Fetch quotes from server or use localStorage quotes
    function fetchQuotesFromServer() {
        // Replace with the URL of your server or API endpoint
        const url = "https://api.example.com/quotes";  // Change this to your API

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    quotes = data; // If server returns quotes as an array, use it
                    saveQuotes(); // Optionally, save fetched quotes to localStorage
                    showRandomQuote(); // Show a random quote after fetching
                    populateCategories(); // Re-populate categories after fetching
                } else {
                    console.error("Server response is not in expected format.");
                }
            })
            .catch(error => {
                console.error("Error fetching quotes:", error);
                // Fall back to localStorage or default quotes if fetching fails
                quotes = JSON.parse(localStorage.getItem("quotes")) || [
                    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
                    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
                    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
                ];
                showRandomQuote(); // Show a random quote after loading from fallback
                populateCategories(); // Re-populate categories if fallback is used
            });
    }

    // Load quotes from localStorage or fallback to the server fetch
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    if (quotes.length === 0) {
        fetchQuotesFromServer(); // Fetch quotes from the server if localStorage is empty
    } else {
        showRandomQuote(); // Show a random quote from localStorage if available
        populateCategories(); // Populate categories from localStorage
    }

    // DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");

    // Save quotes to localStorage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Show a random quote from the filtered list
    function showRandomQuote() {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);

        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available for this category.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><strong>Category:</strong> ${quote.category}</p>`;
        sessionStorage.setItem("lastQuote", JSON.stringify(quote));  // Save the last shown quote
    }

    // Add a new quote to the quotes array
    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes();
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
            showRandomQuote();
            populateCategories(); // Re-populate the category dropdown after adding a new quote
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    // Populate the category filter dropdown dynamically
    function populateCategories() {
        const categories = new Set(quotes.map(quote => quote.category)); // Get unique categories
        categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset to 'All Categories'

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Set the last selected category from localStorage
        const lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
        categoryFilter.value = lastSelectedCategory;
    }

    // Filter quotes based on the selected category
    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory); // Save selected category
        showRandomQuote(); // Show a random quote based on the filter
    });

    // Initialize the page
    function init() {
        populateCategories(); // Populate category filter dropdown
        newQuoteButton.addEventListener("click", showRandomQuote); // Button to show random quote
        showRandomQuote(); // Show a random quote on page load
    }

    init(); // Call the init function when the DOM is ready
});
