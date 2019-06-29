var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

const CACHE_USER_NAME = 'user-request-v1';
const fetchUrl = 'https://httpbin.org/get';
let networkDataReceived = false;

function openCreatePostModal() {
  createPostArea.style.display = 'block';

  // Old Install Banner setup
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      if (choiceResult.outcome === 'dismissed') {
        // User cancelled
      } else {
        // User added to home screen
      }
    });

    deferredPrompt = null;
  }

  // if ('serviceWorker' in navigator) {
  //   // Unregister SW in all pages
  //   navigator.serviceWorker.getRegistrations().then((registrations) => {
  //     registrations.forEach(registration => {
  //       registration.unregister(); // Also clears cache
  //     });
  //   });
  // }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

function onSaveButtonClicked(event) {
  console.log('Clicked');

  // Cache new element on save
  if ('caches' in window) { // Needs to be validated on Frontend
    caches.open(CACHE_USER_NAME).then(function (cache) {
      caches.addAll([
        'https://httpbin.org/get',
        '/src/images/sf-boat.jpg'
      ]);

      return res;
    });
  }
}

// Remove latest card
function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Create Fake Card element
function createCard() {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'black';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'San Francisco Trip';
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'In San Francisco';
  cardSupportingText.style.textAlign = 'center';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}


fetch(fetchUrl)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    clearCards();
    createCard();
  });

// POST Example
// Cache does not saves POST Requests, only response
// fetch(fetchUrl, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   },
//   body: JSON.stringify({
//     message: 'Somme message'
//   })
// })
//   .then(function (res) {
//     return res.json();
//   })
//   .then(function (data) {
//     networkDataReceived = true;
//     clearCards();
//     createCard();
//   });


if ('caches' in window) { // Needs to be validated on Frontend
  caches.match(fetchUrl).then((response) => {
    if (response) {
      return response.json();
    }
  }).then(data => {
    if (!networkDataReceived) {
      clearCards();
      createCard();
    }
  });
}

