document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const syncNotification = document.getElementById("syncNotification");
    const resolveConflictBtn = document.getElementById("resolveConflictBtn");

    // Simulate server URL (JSONPlaceholder or similar mock API)
    const serverUrl = "https://jsonplaceholder.typicode.com/posts/1"; // This is just a mock

    // Save quotes to localStorage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Fetch quotes from the server and sync with local data
    async function syncWithServer() {
        try {
            const response = await fetch(serverUrl);
            const serverData = await response.json();

            // Simulate server having updated data
            const serverQuotes = [
                { text: "New quote from server.", category: "Motivation" },
                { text: "Updated quote on server.", category: "Inspiration" }
            ];

            // Check for conflict (simplified comparison)
            if (JSON.stringify(quotes) !== JSON.stringify(serverQuotes)) {
                // Handle conflict: Server data takes precedence
                quotes = serverQuotes;
                saveQuotes();
                showSyncNotification();
            }

        } catch (error) {
            console.error("Error syncing with server:", error);
        }
    }

    // Show notification when sync happens
    function showSyncNotification() {
        syncNotification.style.display = "block";
    }

    // Resolve conflict manually
    resolveConflictBtn.addEventListener("click", () => {
        // Here you can implement logic to resolve conflicts manually if desired.
        // For now, we just hide the notification.
        syncNotification.style.display = "none";
    });

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

    // Export quotes as a JSON file
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

    // Import quotes from a JSON file
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
                    populateCategories(); // Re-populate categories after importing
                } else {
                    alert("Invalid file format.");
                }
            } catch (error) {
                alert("Error reading file.");
            }
        };
        fileReader.readAsText(event.target.files[0]);
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

        // Periodic sync with the server
        setInterval(syncWithServer, 30000); // Sync every 30 seconds
    }

    init(); // Call the init function when the DOM is ready
});
