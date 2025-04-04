let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const toyCollectionDiv = document.getElementById('toy-collection');
  
  // Fetch the list of toys
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToyCard(toy);
      });
    });

  // Function to render each toy card
  function renderToyCard(toy) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const toyName = document.createElement('h2');
    toyName.textContent = toy.name;
    
    const toyImage = document.createElement('img');
    toyImage.src = toy.image;
    toyImage.classList.add('toy-avatar');

    const toyLikes = document.createElement('p');
    toyLikes.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement('button');
    likeButton.classList.add('like-btn');
    likeButton.id = toy.id;
    likeButton.textContent = 'Like ❤️';

    // Add the toy elements to the card
    cardDiv.append(toyName, toyImage, toyLikes, likeButton);

    // Append the card to the toy collection div
    toyCollectionDiv.appendChild(cardDiv);

    // Add event listener for the like button
    likeButton.addEventListener('click', () => increaseLikes(toy, toyLikes));
  }

  // Function to handle the like button click
  function increaseLikes(toy, toyLikes) {
    const newLikes = toy.likes + 1;

    // Send a PATCH request to update the likes
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then(response => response.json())
      .then(updatedToy => {
        toyLikes.textContent = `${updatedToy.likes} Likes`;
      });
  }
});


// Add event listener for the 'Create Toy' button to show/hide form
const newToyForm = document.querySelector('.add-toy-form');
const createToyButton = document.querySelector('#new-toy-btn');

createToyButton.addEventListener('click', () => {
  const form = document.querySelector('.add-toy-form');
  form.style.display = form.style.display === 'block' ? 'none' : 'block';
});

// Add event listener for submitting the form to create a new toy
newToyForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const image = e.target.image.value;

  const newToy = {
    name: name,
    image: image,
    likes: 0,
  };

  // Send a POST request to add a new toy
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(newToy),
  })
    .then(response => response.json())
    .then(toy => {
      renderToyCard(toy);
      newToyForm.reset(); // Reset form fields
    });
});
