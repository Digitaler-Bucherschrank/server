export interface ISBNdbBook 
  {
    "title": string,
    "title_long": string,
    "isbn": string,
    "isbn13": string,
    "dewey_decimal": string,
    "binding": string,
    "publisher": string,
    "language": string,
    "date_published": 	string,
    "edition": string,
    "pages": 0,
    "dimensions": string,
    "overview": string,
    "image": string,
    "msrp": 0,
    "excerpt": string,
    "synopsys": string,
    "authors": [
      string
    ],
    "subjects": [
      string
    ],
    "reviews": [
      string
    ],
    "prices": [
      {
        "condition": string,
        "merchant": string,
        "merchant_logo": string,
        "merchant_logo_offset": {
          "x": string,
          "y": string
        },
        "shipping": string,
        "price": string,
        "total": string,
        "link": string
      }
    ],
    "related": {
      "type": string
    }
  }