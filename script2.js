
// Check if the browser supports SpeechRecognition API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US'; // Set language for recognition

// Event listener for voice button
document.getElementById('voiceButton').onclick = () => {
    recognition.start(); // Start listening to the user's voice
};

// Handle speech recognition result
recognition.onresult = (event) => {
    const voiceQuery = event.results[0][0].transcript; // Get the spoken text
    document.getElementById('searchinput').value = voiceQuery; // Populate the search input with the voice query
    searchrecipe(); // Call the search function to perform the recipe search
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    alert('Sorry, there was an issue with voice recognition.');
};




//-------------------------------

// Function to add item to the cart
function addToCart(recipeName, recipeImage, calories, recipeUrl) {
    const cartItem = {
        name: recipeName,
        image: recipeImage,
        calories: calories,
        url: recipeUrl
    };

    // Get the current cart from localStorage, or initialize as an empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the new item to the cart
    cart.push(cartItem);

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${recipeName} has been added to your cart!`);
}

// Function to search recipes
async function searchrecipe() {
    const searchInput = document.getElementById('searchinput').value;
    const recipeContainer = document.getElementById('recipecontainer');
    const foodCardsContainer = document.getElementById('dynamic-food-cards');
    const backButton = document.getElementById('backButton');

    if (searchInput === "") {
        alert("Please enter a recipe");
        return;
    }

    foodCardsContainer.style.display = "none"; // Hide the food cards
    backButton.style.display = "inline-block"; // Show the back button when recipes are visible

    try {
        const response = await fetch(`https://api.edamam.com/search?q=${searchInput}&app_id=40b53e5e&app_key=a9916ab9a735ea18f2077365e39861a5`);
        const data = await response.json();

        if (data.hits.length === 0) {
            recipeContainer.innerHTML = "<p>No recipes found for your search.</p>";
            return;
        }

        // Display fetched recipes
        data.hits.forEach((recipe) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

            recipeDiv.innerHTML = `
                <h2>${recipe.recipe.label}</h2>
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
                <p>Calories: ${Math.round(recipe.recipe.calories)}</p>
                <p>Servings: ${recipe.recipe.yield}</p>
                <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
                <button onclick="addToCart('${recipe.recipe.label}', '${recipe.recipe.image}', ${Math.round(recipe.recipe.calories)}, '${recipe.recipe.url}')">
                    Add to Cart
                </button>
            `;

            recipeContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        recipeContainer.innerHTML = "<p>There was an error fetching recipes. Please try again later.</p>";
    }
}






window.onload = function () {
    // Check if user is logged in
    let isLoggedIn = window.localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        // If the user is not logged in, show food items but alert on item click
        fetchFoodCards();
        document.getElementById('logoutButton').style.display = "none"; // Hide logout button if not logged in
    } else {
        // If user is logged in, show food items and logout button
        fetchFoodCards();
        document.getElementById('logoutButton').style.display = "inline-block"; // Show logout button
    }
};

// Function to display food cards
async function fetchFoodCards() {
    const foodItems = [
        { name: 'Chicken', description: 'Delicious grilled chicken with spices', imageUrl: 'chicken.jpg' },
        { name: 'Mutton', description: 'Tender mutton curry with herbs', imageUrl: './mutton.webp'},
        { name: 'Ice Cream', description: 'Creamy vanilla ice cream topped with chocolate sauce', imageUrl: './ice cream.webp' },
        { name: 'Biryani', description: 'Aromatic biryani with rice and spices', imageUrl: './Biryani.jpg' },
        { name: 'Pizza', description: 'Cheesy pizza with a crispy crust', imageUrl: './pizza.jpg' },
        { name: 'Pasta', description: 'Creamy pasta with mushrooms and cheese', imageUrl: './pasta.avif' }
    ];

    const foodCardsContainer = document.getElementById('dynamic-food-cards');
    // foodCardsContainer.innerHTML = ""; // Clear any existing food cards

    // Generate food cards dynamically
    foodItems.forEach(item => {
        const foodCard = document.createElement('div');
        foodCard.classList.add('food-card');

        foodCard.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button onclick="checkLoginAndSearch('${item.name}')">Search for ${item.name} Recipe</button>
           
        `;

        foodCardsContainer.appendChild(foodCard);
    });
}
//----------------------

// Function to check if user is logged in before performing any action
function checkLoginAndSearch(foodItem) {
    const isLoggedIn = window.localStorage.getItem('isLoggedIn');  
    
    
    if (isLoggedIn!== 'true') {
        alert(" You need to login .");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }


    // If logged in, proceed with searching the recipe
    searchForRecipe(foodItem);
}

// Function to perform the recipe search
function searchForRecipe(foodItem) {
    document.getElementById('searchinput').value = foodItem; // Set the food item as search query
    searchrecipe(); // Call search function to fetch recipes
}

// Function to fetch recipes based on the search input
async function searchrecipe() {
    const searchInput = document.getElementById('searchinput').value;
    const recipeContainer = document.getElementById('recipecontainer');
    const foodCardsContainer = document.getElementById('dynamic-food-cards');
    const backButton = document.getElementById('backButton');


   //search input to search the recipe then first login 
    const isLoggedIn = window.localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        alert("You need to log in first to view recipes.");
        // const myWindow = window.open('http://127.0.0.1:5500/login.html', 'myWindow', 'width=600,height=400');

        window.location.href = "login.html"; // Redirect to login page if not logged in
        return;
    }




    recipeContainer.innerHTML = ""; // Clear previous recipe results

    if (searchInput === "" ) {
        alert("pleas enter the recipe")
        // fetchFoodCards(); // Reload food items if search input is empty
        return;
    }

    foodCardsContainer.style.display = "none"; // hide the food cards
    backButton.style.display = "inline-block"; // Show the back button when recipes are visible

    try {
        const response = await fetch(`https://api.edamam.com/search?q=${searchInput}&app_id=40b53e5e&app_key=a9916ab9a735ea18f2077365e39861a5`);
        const data = await response.json();
        // console.log(data)
        if (data.hits.length === 0) {
            recipeContainer.innerHTML = "<p style='color: white; text-shadow: 2px 2px 4px rgba(45, 17, 17, 0.5); font-size: 16px;'>No recipes found for your search.</p>"; 
            return;
        }


        // Display fetched recipes
        data.hits.forEach((recipe) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

            recipeDiv.innerHTML = `
                <h2>${recipe.recipe.label}</h2>
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
                <p>Calories: ${Math.round(recipe.recipe.calories)}</p>
                <p>Servings: ${recipe.recipe.yield}</p>
                <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
               <button onclick="addToCart('${recipe.recipe.label}', '${recipe.recipe.image}', ${Math.round(recipe.recipe.calories)}, '${recipe.recipe.url}')">
            ADD TO CART
        </button>
            `;
            
            recipeContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        recipeContainer.innerHTML = "<p>There was an error fetching recipes. Please try again later.</p>";
    }
}

//----------------
//---------------



// Back button functionality to return to food items
document.getElementById('backButton').addEventListener('click', function () {
    document.getElementById('searchinput').value = ""; // Clear search input
    // fetchFoodCards(); // Reload food items
    document.getElementById('recipecontainer').innerHTML = ""; // Clear recipe results
    document.getElementById('dynamic-food-cards').style.display = ""; // Show food cards again
    document.getElementById('backButton').style.display = "none"; // Hide back button
});

// Logout button functionality
document.getElementById('logoutButton').addEventListener('click', function () {
    window.localStorage.removeItem('isLoggedIn'); // Remove login status
    alert("You have been logged out.");
    window.location.href = "login.html"; // Redirect to login page
});
