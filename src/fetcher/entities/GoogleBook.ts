export interface GoogleBook {
  "id": string,
  "selfLink": string,
  "volumeInfo": {
    "title": string,
    "subtitle": string,
    "authors": [
      string
    ],
    "publisher": string,
    "publishedDate": string,
    "description": string,
    "pageCount": Number,
    "mainCategory": string,
    "categories": [
      string
    ],
    "averageRating": Number,
    "ratingsCount": Number,
    "contentVersion": string,
    "imageLinks": {
      "thumbnail": string,
      "large": string,
      "extraLarge": string
    },
    "language": string,
    "previewLink": string,
    "infoLink": string,
    "canonicalVolumeLink": string
  }
}