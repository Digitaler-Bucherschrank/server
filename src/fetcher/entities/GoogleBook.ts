export interface GoogleBook {
  "id": String,
  "selfLink": String,
  "volumeInfo": {
    "title": String,
    "subtitle": String,
    "authors": [
      String
    ],
    "publisher": String,
    "publishedDate": String,
    "description": String,
    "pageCount": Number,
    "mainCategory": String,
    "categories": [
      String
    ],
    "averageRating": Number,
    "ratingsCount": Number,
    "contentVersion": String,
    "imageLinks": {
      "thumbnail": String,
      "large": String,
      "extraLarge": String
    },
    "language": String,
    "previewLink": String,
    "infoLink": String,
    "canonicalVolumeLink": String
  }
}