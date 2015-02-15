# Instagarm User Hash Searcher

This service lets you search for a Instagram user's picture that contain a certain hashtag.

## Usage

````
GET http://instagram-user-hash-searcher.herokuapp.com/search/user/:username/:hashtag?amount=:amountToSearch
````

for example:

````
GET http://instagram-user-hash-searcher.herokuapp.com/search/user/mgonto/tw?amount=1
````

## Install your own

Just set the enviroment variable `CLIENT_ID` with your client_id from Instagram or create a `.env` file with that variable

## License

MIT
