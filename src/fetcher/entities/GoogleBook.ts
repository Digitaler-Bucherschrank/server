export interface GoogleBook {
  "kind": "books#volume",
  "id": String,
  "etag": String,
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
      "smallThumbnail": String,
      "thumbnail": String,
      "small": String,
      "medium": String,
      "large": String,
      "extraLarge": String
    },
    "language": String,
    "previewLink": String,
    "infoLink": String,
    "canonicalVolumeLink": String
  },
}