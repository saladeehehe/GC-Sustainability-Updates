import "@mantine/core/styles.css";
import { MantineProvider, Button, Dialog, Text } from "@mantine/core";
import { theme } from "./theme";
import { Welcome } from "./Heading/Heading.tsx";
import NewsComponent from "./Components/newsComponent.tsx";
import { NavbarMinimal } from "./Components/NavBarMinimal";
import { useState, useEffect,  useMemo, useCallback  } from 'react';
import { NewsArticle } from './Components/newsComponent';
import { convertToDate } from './utils/dateUtils';
import { categorizeArticle } from './Components/articleCategorizer.ts';
import SearchBar from './Components/SearchBar'
import './App.css';
import * as styles from './Heading/Heading.css.ts'
import SourcesComponent from './SourcesComponent';


// fetch news data from API and handle loading and error states
const fetchNewsData = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    setLoading(true);
    const response = await fetch('/GC-Sustainability-Updates/news_data2.json');
    if (!response.ok) throw new Error('Failed to fetch news data');
    const data = await response.json();
    return data;
  } catch (error: any) {
    setError(error.message);
    return [];
  } finally {
    setLoading(false);
  }
};

// Extract unique sources and categories from news data
const extractSources = (newsData: NewsArticle[]): string[] => {
  return Array.from(new Set(newsData.map(article => article.source)));
};

const extractCategories = (newsData: NewsArticle[]): string[] => {
  const categoriesSet = new Set<string>();
  newsData.forEach(article => {
    (article.categories || []).forEach(category => categoriesSet.add(category));
  });
  return Array.from(categoriesSet);
};

// Custom hook to manage news data state and effects
const useNewsData = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load news data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchNewsData(setLoading, setError);
      const processedData = data.map((article: any) => ({
        ...article,
        date: convertToDate(article.date),
        categories: categorizeArticle(article.title || article.main_content_words || article.summary || "") || [],
        bookmarked: false,
      })) as NewsArticle[];
      
      // Sort articles by date in descending order
      processedData.sort((a, b) => b.date.getTime() - a.date.getTime());

      // Load bookmarks from localStorage and update articles' bookmarked state
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      processedData.forEach(article => {
        if (bookmarks.includes(article.title)) {
          article.bookmarked = true;
        }
      });

      setNewsData(processedData);
      setSources(extractSources(processedData));
      setCategories(extractCategories(processedData));
      setFilteredData(processedData);
    };

    loadData();
  }, []);

  return { newsData, sources, categories, filteredData, loading, error, setNewsData, setFilteredData };
};

export default function App() {
  const {
    newsData,
    sources,
    categories,
    filteredData,
    loading,
    error,
    setNewsData,
    setFilteredData,
  } = useNewsData();

  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [showBookmarkedArticles, setShowBookmarkedArticles] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [showSources, setShowSources] = useState<boolean>(false);

  // Memoized filtered data based on selected filters (caching results of computation to improve performance)
  const filteredDataMemo = useMemo(() => {
    if (showBookmarkedArticles) {
      return newsData.filter(article => article.bookmarked);
    }

    return newsData.filter(article => {
      const articleDate = new Date(article.date);
      const [startDate, endDate] = dateRange;

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
        ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.summary?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return withinDateRange && matchesSource && matchesCategory && matchesSearchTerm;
    });
  }, [showBookmarkedArticles, newsData, selectedSources, selectedCategories, dateRange, searchTerm]);

  useEffect(() => {
    setFilteredData(filteredDataMemo);
  }, [filteredDataMemo, setFilteredData]);

  // Handlers for filter changes
  const handleSourceFilterChange = useCallback((selectedSources: string[]) => setSelectedSources(selectedSources), []);
  const handleCategoryFilterChange = useCallback((selectedCategories: string[]) => setSelectedCategories(selectedCategories), []);
  const handleDateRangeChange = useCallback((startDate: Date | null, endDate: Date | null) => setDateRange([startDate, endDate]), []);
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value), []);
  
  // Toggle showing bookmarked articles
  const toggleBookmark = useCallback((title: string) => {
    const updatedNewsData = newsData.map(article =>
      article.title === title ? { ...article, bookmarked: !article.bookmarked } : article
    );
    setNewsData(updatedNewsData);
    const bookmarks = updatedNewsData.filter(article => article.bookmarked).map(article => article.title);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [newsData, setNewsData]);

  const toggleShowBookmarkedArticles = useCallback(() => setShowBookmarkedArticles(prev => !prev), []);
  const clearAllBookmarks = useCallback(() => {
    const updatedNewsData = newsData.map(article => ({ ...article, bookmarked: false }));
    setNewsData(updatedNewsData);
    setFilteredData(updatedNewsData);
    setOpenConfirmation(false);
  }, [newsData, setNewsData, setFilteredData]);

  if (loading) return  <div className="loading-container"><p>Loading...</p></div>;
  if (error) return <div className="loading-container"><p>Error: {error}</p></div>;

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
            toggleShowBookmarkedArticles={toggleShowBookmarkedArticles}
            selectedSources={selectedSources}
            selectedCategories={selectedCategories}
            toggleSources={() => setShowSources(!showSources)} // Pass toggle handler
          />
        </div>
        <div className="main-content">
          <div className={styles.welcomeComponent}>
            <Welcome />
          </div>
          {showSources ? (
            <SourcesComponent />
          ) : (
            <>
              <div style={{ textAlign: 'right', padding: '20px' }}>
                <Button onClick={() => setOpenConfirmation(true)}>Clear All Bookmarks</Button>
              </div>
              <Dialog
                opened={openConfirmation}
                onClose={() => setOpenConfirmation(false)}
                title="Confirm Action"
              >
                <Text>Are you sure you want to clear all bookmarks? This action cannot be undone.</Text>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={clearAllBookmarks} style={{ marginRight: '10px' }}>Yes, Clear</Button>
                  <Button variant="outline" onClick={() => setOpenConfirmation(false)}>Cancel</Button>
                </div>
              </Dialog>
              <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
              <NewsComponent newsData={filteredData} toggleBookmark={toggleBookmark} />
            </>
          )}
        </div>
      </div>
    </MantineProvider>
  );
}