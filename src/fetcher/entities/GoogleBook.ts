export interface GoogleBook {
  id: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: [string];
    industryIdentifiers: any[];
    publisher: string;
    publishedDate: string;
    description: string;
    pageCount: number;
    mainCategory: string;
    categories: [string];
    averageRating: number;
    ratingsCount: number;
    contentVersion: string;
    imageLinks: {
      thumbnail: string;
      large: string;
      extraLarge: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
}
