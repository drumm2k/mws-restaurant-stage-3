'use strict'

let restaurant;
let map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    })
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  if (restaurant.photograph == undefined) {
    image.src = '/img/nophoto.jpg';
  } else {
    image.src = '/img/' + restaurant.photograph + '-400.jpg';
  }
  image.alt = 'Image of the ' + restaurant.name + ' Restaurant';

  const picture = document.getElementById('restaurant-img-media');
  picture.media = '(min-width: 450px)';
  if (restaurant.photograph == undefined) {
    picture.srcset = '/img/nophoto.jpg';
  } else {
    picture.srcset = '/img/' + restaurant.photograph + '.jpg';
  }

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }

  // fetch and fill reviews
  fetchReviews();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    hours.appendChild(row);
  }
}

/**
 * Get reviews
 */
const fetchReviews = (callback) => {
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchReviewsById(restaurant.id, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.error(error);
        return;
      }
      fillReviewsHTML();
    })
  }
}

/**
 * Add Review form submission
 */
const addReview = () => {
  event.preventDefault();

  const id = getParameterByName('id');
  const name = document.getElementById('review-name');
  const rating = document.querySelector('#rating option:checked');
  const comments = document.getElementById('review-comments');
  let reviewData = {};

  //reset errors
  name.style.borderColor = '';
  comments.style.borderColor = '';

  //restaurant id
  reviewData.restaurant_id = parseInt(id);

  //name
  const namePattern = /^[A-Za-z0-9'`-\s]+$/i;
  if (!namePattern.test(name.value)) {
    name.style.borderColor = 'red';
  }
  else {
    reviewData.name = name.value;
  }

  //date
  reviewData.createdAt = new Date().toLocaleString();
  
  //rating
  reviewData.rating = parseInt(rating.value);
  
  //comments
  const commentsPattern = /^[^\>]+$/i;
  if (!commentsPattern.test(comments.value)) {
    comments.style.borderColor = 'red';
  }
  else {
    reviewData.comments = comments.value;
  }

  //check if all inputs added
  if (Object.keys(reviewData).length == 5) {
    document.getElementById('review-form').reset();
    DBHelper.sendReview(reviewData);
    
    const container = document.getElementById('reviews-container');
    const ul = document.getElementById('reviews-list');
    ul.appendChild(createReviewHTML(reviewData, true));
    container.appendChild(ul);
  }
  console.log(reviewData);
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  title.tabIndex = '0';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }

  if (Object.keys(reviews).length === 0) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'Offline mode! No cached reviews for this restaurant.';
    container.appendChild(noReviews);
    return;
  }

  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });

  //check localstorage for offline review
  let reviewLocal = JSON.parse(localStorage.getItem('reviewOffline'));

  if (reviewLocal !== null) {
    ul.appendChild(createReviewHTML(reviewLocal, true));
    DBHelper.sendReviewOnline();
  }

  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review, offline) => {
  const li = document.createElement('li');

  if(!navigator.onLine && offline) {
    const offline = document.createElement('div');
    offline.className = 'reviews-offline';
    offline.innerHTML = 'OFFLINE';
    li.appendChild(offline);
  }

  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = new Date(review.createdAt).toLocaleString();
  li.appendChild(date);

  const rating = document.createElement('p');
  let stars = '★'.repeat(review.rating);
  rating.className = 'reviews-list__stars';
  rating.innerHTML = stars;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);
  
  li.tabIndex = '0';
  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
