# API Documentation

This documentation provides an overview of the available routes and data models for the Host and Toast Application.

## Routes

In this section, you will find detailed information about the different routes available in the API.
The API offers a variety of routes to work with _user_, _meal_ and _rating_ documents. Each route is associated with a specific HTTP verb and URL, allowing you to perform CRUD (Create, Read, Update, and Delete) actions on the data.

<br>

#### User routes

| HTTP verb | URL                          | Request body | Action                                                         |
| --------- | ---------------------------- | ------------ | -------------------------------------------------------------- |
| POST      | `/auth/signup`               | JSON         | Creates a new user                                             |
| POST      | `/auth/login`                | JSON         | Logges the user in and generates JWT Token                     |
| GET       | `/auth/verify`               | (empty)      | Verifies the users JWT token, which is **sent in the headers** |
| GET       | `/auth/users`                | (empty)      | Returns all the users in JSON format                           |
| GET       | `/auth/user/:userId`         | (empty)      | Returns the specified user by id                               |
| PUT       | `/auth/user/:userId`         | JSON         | Updates the specified user by id                               |
| DELETE    | `/auth/user/:userId`         | (empty)      | Deletes the specified user by id                               |
| GET       | `/auth/users/rating/:userId` | (empty)      | Get the average rating for the user                            |
| HTTP verb | URL                          | Request body | Action                                                         |
| --------- | ---------------------        | ------------ | -------------------------------------------------------------- |
| POST      | `/auth/signup`               | JSON         | Creates a new user                                             |
| POST      | `/auth/login`                | JSON         | Logges the user in and generates JWT Token                     |
| GET       | `/auth/verify`               | (empty)      | Verifies the users JWT token, which is **sent in the headers** |
| GET       | `/auth/users`                | (empty)      | Returns all the users in JSON format                           |
| GET       | `/auth/users/:userId`        | (empty)      | Returns the specified user by id                               |
| PUT       | `/auth/users/:userId`        | JSON         | Updates the specified user by id                               |
| DELETE    | `/auth/users/:userId`        | (empty)      | Deletes the specified user by id                               |

<br>

#### Address routes

| HTTP verb | URL                            | Request body | Action                                                              |
| --------- | ------------------------------ | ------------ | ------------------------------------------------------------------- |
| GET       | `/api/addresses`               | (empty)      | Returns all the addresses in JSON format                            |
| GET       | `/api/addresses/:addressId`    | (empty)      | Returns the specified address by id                                 |
| POST      | `/api/addresses/users/:userId` | JSON         | Creates a new address **and adds the reference to the user object** |
| PUT       | `/api/addresses/:addressId`    | JSON         | Updates the specified address by id                                 |
| DELETE    | `/api/addresses/:addressId`    | (empty)      | Deletes the specified address by id                                 |

<br>

#### Meal routes

| HTTP verb | URL                       | Request body | Action                                                   |
| --------- | ------------------------- | ------------ | -------------------------------------------------------- |
| GET       | `/api/meals`              | (empty)      | Returns all the meals in JSON format                     |
| GET       | `/api/meals/:mealId`      | (empty)      | Returns the specified meal by id                         |
| GET       | `/api/meals/user/:userId` | (empty)      | Returns all the meals of a specified user in JSON format |
| POST      | `/api/meals`              | JSON         | Creates a new meal **with its respective user id**       |
| PUT       | `/api/meals/:mealId`      | JSON         | Updates the specified meal by id                         |
| DELETE    | `/api/meals/:mealId`      | (empty)      | Deletes the specified meal by id                         |

<br>

#### Rating routes

| HTTP verb | URL                          | Request body | Action                                                     |
| --------- | ---------------------------- | ------------ | ---------------------------------------------------------- |
| GET       | `/api/ratings`               | (empty)      | Returns all the ratings in JSON format                     |
| GET       | `/api/ratings/:ratingId`     | (empty)      | Returns the specified meal by id                           |
| GET       | `/api/ratings/meals/:mealId` | (empty)      | Returns all the ratings of a specified meal in JSON format |
| POST      | `/api/ratings`               | JSON         | Creates a new rating **with its respective meal id**       |
| PUT       | `/api/ratings/:ratingId`     | JSON         | Updates the specified rating by id                         |
| DELETE    | `/api/ratings/:ratingId`     | (empty)      | Deletes the specified rating by id                         |

<br>

#### Order routes

| HTTP verb | URL                              | Request body | Action                                                                                      |
| --------- | -------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| GET       | `/api/orders`                    | (empty)      | Returns all the orders in JSON format                                                       |
| GET       | `/api/orders/:orderId`           | (empty)      | Returns the specified order by id                                                           |
| GET       | `/api/orders/user/:userId`       | (empty)      | Returns all the orders of a specified user in JSON format                                   |
| GET       | `/api/orders/chef-stats/:userId` | (empty)      | Returns all the orders states of a specified user in JSON format                            |
| POST      | `/api/orders`                    | JSON         | Creates a new order **w.r.t user id & meal id. Updates the meal Model for leftover plates** |
| PUT       | `/api/orders/:orderId`           | JSON         | Updates the specified order by id                                                           |
| DELETE    | `/api/orders/:orderId`           | (empty)      | Deletes the specified order by id                                                           |

<br>

#### Index routes

| HTTP verb | URL                     | Request body | Action                                        |
| --------- | ----------------------- | ------------ | --------------------------------------------- |
| POST      | `/api/multiple-uploads` | JSON         | Uploads imgs on Cloudinary and return the URL |

<br>

## Models

The _Models_ section holds information about the data models for your database. It outlines the structure of the documents in the database, providing you with a clear understanding of how your data should be organized.

<br>

#### User model

| field         | data type    | description                                 |
| ------------- | ------------ | ------------------------------------------- |
| `username`    | _`String`_   | Unique identifier for the user. required.   |
| `email`       | _`String`_   | Email of the cohort. required. unique.      |
| `password`    | _`String`_   | Password of that user. encrypted. required. |
| `address`     | _`ObjectId`_ | Reference to address.                       |
| `imageUrl`    | _`String`_   | URL of profile image.                       |
| `description` | _`String`_   | Description of user.                        |
| `specialty`   | _`String`_   | Specialty in cooking of user.               |

<br>

#### Address Model

| Field         | Data Type  | Description                                     |
| ------------- | ---------- | ----------------------------------------------- |
| `displayName` | _`String`_ | Display name coming from leaflet api. Required. |
| `long`        | _`Number`_ | Longitude of Location.                          |
| `lat`         | _`Number`_ | Latitude of Location                            |

<br>

#### Meal Model

| Field          | Data Type            | Description                         |
| -------------- | -------------------- | ----------------------------------- |
| `cuisine`      | _`String`_           | Cuisine of meal. Required.          |
| `title`        | _`String`_           | Title of meal. Required.            |
| `description`  | _`String`_           | Description of meal. Required.      |
| `allergies`    | _`Array`_ of Strings | Array holding different values.     |
| `plates`       | _`Number`_           | Number of plates available.         |
| `hosted`       | _`Boolean`_          | Hosted or pickup. Required.         |
| `completeMeal` | _`Boolean`_          | Complete meal or single ingredient. |
| `date`         | _`Date`_             | Date for pickup/hosted.             |
| `user`         | _`ObjectId`_         | Reference to user. Required.        |
| `imageUrl`     | _`Array`_ of Strings | URL of image.                       |
| `price`        | _`Number`_           | Price of the meal.                  |

<br>

#### Rating Model

| Field     | Data Type    | Description                                     |
| --------- | ------------ | ----------------------------------------------- |
| `stars`   | _`Number`_   | Rating of meal. Required.                       |
| `comment` | _`String`_   | Comment to rating.                              |
| `meal`    | _`ObjectId`_ | Reference to rated meal. Required.              |
| `user`    | _`ObjectId`_ | Reference to user who rated the meal. Required. |

#### Order Model

| Field    | Data Type    | Description                                                |
| -------- | ------------ | ---------------------------------------------------------- |
| `meal`   | _`String`_   | Reference to meal. Required.                               |
| `plates` | _`plates`_   | Number of plates ordered. Required.                        |
| `price`  | _`Number`_   | Price of the order.                                        |
| `user`   | _`ObjectId`_ | Reference to user. Required.                               |
| `status` | _`String`_   | Status of the order ["FINISHED", "IN_PROGRESS"]. Required. |

<br>
