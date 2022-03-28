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

//-------------------
function getData() {
  fetch('http://localhost:3000/toys') // fetching the toy data from the API
    .then(response => response.json()) // translating the json text API into something the JavaScript will understand
    .then(data => { // manipulate the data coming in from the API
      const toyCollection = document.getElementById('toy-collection'); // creating a var to hold the toy-collection div
      let toyContainer = document.createElement('div');
      data.forEach(toy => { // loop through each toy and do stuff to them
        const div = document.createElement('div'); // crete a div to hold each toy
        const h2 = document.createElement('h2'); // create an h2 element for each toy
        const img = document.createElement('img'); // create an img element for each toy
        const p = document.createElement('p'); // create a p element for each toy
        const btn = document.createElement('button'); // create a button element for each toy
              
        h2.innerHTML = toy.name; // assign each toy's name to the h2 element
        img.src = toy.image; // assign each toy's image url to the image element
        img.className = 'toy-avatar'; // assign a cass name to each image element
        p.innerHTML = `${toy.likes} Likes`; // assign the amount of likes of each toy to the paragraph element
        btn.className = 'like-btn'; // assign a class name to each button element
        btn.id = toy.id; // assign each toy's id to the button element
        btn.innerHTML = 'Like ❤️'; // asssign text to each toy's button
        div.className = 'card'; // assigning a class name to each div element

        div.append(h2, img, p, btn); // appending/adding the h2, img, p, and btn elements to the div element
        toyContainer.append(div); // appending/adding the div element to the toyCollection element/div
      })
      toyCollection.replaceWith(toyContainer);
      toyContainer.id = 'toy-collection';
      clickLike();
    })
}

function postToy(toyName, toyImage, toyLikes) { // turning the POST request into a function, taking in three parameters, to be the body
  fetch('http://localhost:3000/toys', { // fetching the toy data from the API, and setting up the POST information
    method: 'POST', // assigning a POST method
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      'name': toyName,
      'image': toyImage,
      'likes': toyLikes
    })
  }) 
    .then(response => response.json()) // traslating the json text API into something JavaScript will understand
    .then(data => {
      getData()
    })
  }

function createToy() {
  const createToyBtn = document.querySelector('.submit');
  createToyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const toyName = e.target.parentNode[0].value;
    const toyURL = e.target.parentNode[1].value;
    
    postToy(toyName, toyURL, 0);
    // getData();

    e.target.parentNode.reset();
  })
}

function updateLikes(id, newNumberOfLikes) {
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      'likes': newNumberOfLikes
    })
  })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      fetch(`http://localhost:3000/toys/${id}`)
        .then(response => response.json())
        .then(data => {
          let toyId = document.getElementById(id).parentNode;
          toyId.childNodes[2].textContent = `${newNumberOfLikes} Likes`;
          // console.log('likes', data.likes);
          
        })
    });
}

function clickLike() {
  const likeButtons = document.getElementsByClassName('like-btn');
  for (let i = 0; i < likeButtons.length; i++) {
    let currentLike = likeButtons[i];
    currentLike.addEventListener('click', (e) => {
      let id = e.target.id;
      let numId = parseInt(id);
      let currentLike = e.target.parentNode.childNodes[2].textContent;
      let numLike = parseInt(currentLike);
      numLike += 1;
      // console.log(e.target.parentNode);
      // console.log(currentLike.slice(0, 1));
      // console.log(currentLike);
      // console.log(numLike);
      // console.log(typeof numId);
      // console.log(id);
      updateLikes(numId, numLike);
      // console.log('hi')
    })
  }
}

createToy();
getData();


// capture that toy's id,
// calculate the new number of likes,
// submit the patch request, and
// update the toy's card in the DOM based on the Response returned by the fetch request.


// Create an event listener that gives users the ability to click a button to "like" a toy. When the button is clicked, the number of likes should be updated in the database and the updated information should be rendered to the DOM
