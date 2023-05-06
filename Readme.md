# BACKEND FOR Paradigms project
## Contributors
- Waza Banda
- Twaambo
- Tom Chileshe

# Routes
### Movies
**BaseHost** -> `host/api/movies`
``` json
POST
/
{
    "movie":"api movie id"
}
Thats the payload

GET
/:id
pass the db id of a movie and get all information about the movie as well as its reviews and rating

POST
/rate
{
    "user": "user id",
    "movieId": "db movie id"
    "rating": a number
}

POST
/review

{
    "user":"27382udssdsd",
    "movieId":"644a5329f2958b8e1122b72f",
    "content": "good"
}


```

### AUTH
**BaseHost** -> `host/api/auth`
``` json
POST
/sign-up
{
    "email": "email",
    "password": "123",
    "firstName": "waza",
    "lastName": "banda",
    "username": "mega2503"

}
/login
POST
{
    {
    "password": "123",
    "username": "mega2503"
    }
}

the response from this contains the authentication header
```