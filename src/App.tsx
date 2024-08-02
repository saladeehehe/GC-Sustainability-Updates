import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Welcome } from "./Welcome/Welcome";
import NewsComponent from "./Components/newsComponent.tsx";
import { NavbarMinimal } from "./Components/NavBarMinimal";
import { ColorSchemeToggle } from "./ColorSchemeToggle/ColorSchemeToggle";
import { useState, useEffect } from 'react';
import { NewsArticle } from './Components/newsComponent';
import { convertToDate } from './utils/dateUtils';
import { categorizeArticle } from './articleCategorizer';
import {SearchBar} from '.Components/SearchBar'
import './App.css'; // Ensure this is where you put the .mainContent styles

const extractSources = (newsData: NewsArticle[]): string[] => {
  const sourcesSet = new Set(newsData.map(article => article.source));
  return Array.from(sourcesSet);
};

const extractCategories = (newsData: NewsArticle[]): string[] => {
  const categoriesSet = new Set<string>();
  newsData.forEach(article => {
    (article.categories || []).forEach(category => categoriesSet.add(category));
  });
  return Array.from(categoriesSet);
};

export default function App() {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [showBookmarkedArticles, setShowBookmarkedArticles] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search term


  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/news_data2.json');
        if (!response.ok) {
          throw new Error('Failed to fetch news data');
        }
        const data = await response.json();
        const newsData = data.map((article: any) => ({
          ...article,
          date: convertToDate(article.date),
          categories: categorizeArticle(article.main_content_words || article.summary || article.title || "") ||[],
          bookmarked: false,
        })) as NewsArticle[];

        // Sort news data by date in descending order
        newsData.sort((a, b) => b.date.getTime() - a.date.getTime());

        setNewsData(newsData);
        setSources(extractSources(newsData));
        setCategories(extractCategories(newsData)); // Extract categories
        setFilteredData(newsData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Selected Categories:", selectedCategories);

    if (showBookmarkedArticles) {
      const bookmarkedArticles = newsData.filter(article => article.bookmarked);
      setFilteredData(bookmarkedArticles);
    } else {
      const filtered = newsData.filter(article => {
        const articleDate = new Date(article.date);
        const startDate = dateRange[0] ? new Date(dateRange[0]) : null;
        const endDate = dateRange[1] ? new Date(dateRange[1]) : null;

        const withinDateRange = startDate && endDate
          ? articleDate >= startDate && articleDate <= endDate
          : true;

        const matchesSource = selectedSources.length
          ? selectedSources.includes(article.source)
          : true;
        const matchesCategory = selectedCategories.length
          ? (article.categories || []).some(category => selectedCategories.includes(category))
          : true;
        const matchesSearchTerm = searchTerm
          ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.summary.toLowerCase().includes(searchTerm.toLowerCase())
          : true;



        return withinDateRange && matchesSource && matchesCategory && matchesSearchTerm;
      });
      setFilteredData(filtered);
    }
  }, [showBookmarkedArticles, newsData, selectedSources, selectedCategories, dateRange]);

  const handleSourceFilterChange = (selectedSources: string[]) => {
    setSelectedSources(selectedSources);
  };

  const handleCategoryFilterChange = (selectedCategories: string[]) => {
    setSelectedCategories(selectedCategories);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange([startDate, endDate]);
  };
  const toggleBookmark = (title: string) => {
    const updatedNewsData = newsData.map(article => 
      article.title === title ? { ...article, bookmarked: !article.bookmarked } : article
    );
    setNewsData(updatedNewsData);
    setFilteredData(updatedNewsData); // Update filtered data to reflect the change
  };

  const toggleShowBookmarkedArticles = () => {
    setShowBookmarkedArticles(!showBookmarkedArticles);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <MantineProvider theme={theme}>
      <div className="grid-container">
        <div className="navbar">
          <NavbarMinimal 
            sources={sources}
            categories={categories}
            onFilterChange={handleSourceFilterChange}
            onDateRangeChange={handleDateRangeChange}
            onCategoryChange={handleCategoryFilterChange}
            showBookmarkedArticles={showBookmarkedArticles}
            toggleShowBookmarkedArticles={toggleShowBookmarkedArticles} selectedSources={selectedSources} selectedCategories={selectedCategories}           />
        </div>
        <div className="main-content">
          <Welcome />
          <ColorSchemeToggle />
          <NewsComponent newsData={filteredData} toggleBookmark={toggleBookmark} />
        </div>
      </div>
    </MantineProvider>
  );
}
