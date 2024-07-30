export interface NewsArticle {
    title: string;
    summary?: string;
    date: Date;
    source: string
    link: string;
    main_content_words?: string; // Optional field
    related_goals?: string[]; // Optional field

  }
  