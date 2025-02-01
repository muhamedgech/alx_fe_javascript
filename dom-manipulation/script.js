// Array of quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "In the middle of difficulty lies opportunity.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length === 0) {
      quoteDisplay.textContent = "No quotes available. Add a new quote!";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<strong>${randomQuote.text}</strong><br><em>Category: ${randomQuote.category}</em>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
      alert("Please fill in both the quote and category fields.");
      return;
    }
  
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory
    };
  
    quotes.push(newQuote);
    alert("Quote added successfully!");
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
    showRandomQuote(); // Display the newly added quote
  }
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Display a random quote when the page loads
  window.onload = showRandomQuote;