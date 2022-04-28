# movie_api

In this step I am to create a REST API for an application
that interacts with a database that stores data about different movies.
This is a part of the Full Stack Web Development Course by CareerFoundry
and is developed during the learning the FSWD by CF.

## Description

A **myFlix** Application is the server-side component of a full-stack Project and aims
to provide textual information for reading.
The server stores the data about movies and users. 
It will consist of a well-designed REST API and
architected database built using JavaScript, Node.js, Express, and MongoDB. The REST API
will be accessed via commonly used HTTP methods like GET and POST. Similar methods
(CRUD) will be used to retrieve data from the database and store that data in a non-relational
way.
This allows users to register, read information about different movies, and update their
user profiles. 

## Design Criteria

### User Stories
- A User should be able to recieve information on movies, directors, genres and actors.
- A User should be able to create a profile and save the data in FavoriteMoives.

### Essential Features
- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a
  single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

## Technical Requirements
- The API must be a Node.js and Express application.
- The API must use REST architecture, with URL endpoints corresponding to the data
  operations listed above
- The API must use at least three middleware modules, such as the body-parser package for
  reading data from requests and morgan for logging.
- The API must use a “package.json” file.
- The database must be built using MongoDB.
- The business logic must be modeled with Mongoose.
- The API must provide movie information in JSON format.
- The JavaScript code must be error-free.
- The API must be tested in Postman.
- The API must include user authentication and authorization code.
- The API must include data validation logic.
- The API must meet data security regulations.
- The API source code must be deployed to a publicly accessible platform like GitHub.
- The API must be deployed to Heroku.

## Dependencies
- node.js
- bcryptjs
- body-parser
- cors
- express
- express-validator
- jsonwebtoken
- mongoose
- morgan
- passport
- passport-jwt
- passport-local
- swagger-ui-express
- uuid
- nodemon

## Links
For more information regarding the [Documentation](https://github.com/kraft-aka/movie_api/blob/main/public/documentation.html)



