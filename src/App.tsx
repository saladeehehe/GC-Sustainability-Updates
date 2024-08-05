import "@mantine/core/styles.css";
import { MantineProvider, Button, Dialog, Text } from "@mantine/core";
import { theme } from "./theme";
import { Welcome } from "./Welcome/Welcome";
import NewsComponent from "./Components/newsComponent.tsx";
import { NavbarMinimal } from "./Components/NavBarMinimal";
//import { ColorSchemeToggle } from "./ColorSchemeToggle/ColorSchemeToggle";
import { useState, useEffect } from 'react';
import { NewsArticle } from './Components/newsComponent';
import { convertToDate } from './utils/dateUtils';
import { categorizeArticle } from './articleCategorizer';
import SearchBar from './Components/SearchBar'
import './App.css'; // Ensure this is where you put the .mainContent styles
import * as styles from './Welcome/Welcome.css.ts'

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
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false); //for clear bookmarks Dialog



  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/GC-Sustainability-Updates/news_data2.json'); // Updated path
        if (!response.ok) {
          throw new Error('Failed to fetch news data');
        }
        const data = await response.json();
        const newsData = data.map((article: any) => ({
          ...article,
          date: convertToDate(article.date),
          categories: categorizeArticle(article.title || article.main_content_words || article.summary || "") ||[],
          bookmarked: false,
        })) as NewsArticle[];
  
        // Sort news data by date in descending order
        newsData.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        // Load bookmarks from localStorage so that bookmarks persist across page reloads 
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        newsData.forEach(article => {
          if (bookmarks.includes(article.title)) {
            article.bookmarked = true;
          }
        });

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
          ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.summary?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;



        return withinDateRange && matchesSource && matchesCategory && matchesSearchTerm;
      });
      setFilteredData(filtered);
    }
  }, [showBookmarkedArticles, newsData, selectedSources, selectedCategories, dateRange, searchTerm]);

  const handleSourceFilterChange = (selectedSources: string[]) => {
    setSelectedSources(selectedSources);
  };

  const handleCategoryFilterChange = (selectedCategories: string[]) => {
    setSelectedCategories(selectedCategories);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange([startDate, endDate]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleBookmark = (title: string) => {
    const updatedNewsData = newsData.map(article => 
      article.title === title ? { ...article, bookmarked: !article.bookmarked } : article
    );

    setNewsData(updatedNewsData);
    setFilteredData(updatedNewsData); // Update filtered data to reflect the change

    // Update localStorage
    const bookmarks = updatedNewsData.filter(article => article.bookmarked).map(article => article.title);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  const toggleShowBookmarkedArticles = () => {
    setShowBookmarkedArticles(!showBookmarkedArticles);
  };
  const clearAllBookmarks = () => {
    const updatedNewsData = newsData.map(article => ({ ...article, bookmarked: false }));
    setNewsData(updatedNewsData);
    setFilteredData(updatedNewsData);
    setOpenConfirmation(false);
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
          <div className = {styles.welcomeComponent}>
            <Welcome/>
          </div>
          <div style={{ textAlign: 'right', padding: '20px' }}>
            {/* Add the Clear Bookmarks Button */}
            <Button onClick={() => setOpenConfirmation(true)}>
              Clear All Bookmarks
            </Button>
          </div>
            {/* Confirmation Dialog */}
          <Dialog
            opened={openConfirmation}
            onClose={() => setOpenConfirmation(false)}
            title="Confirm Action"
          >
            <Text>Are you sure you want to clear all bookmarks? This action cannot be undone.</Text>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={clearAllBookmarks} style={{ marginRight: '10px' }}>
                Yes, Clear
              </Button>
              <Button variant="outline" onClick={() => setOpenConfirmation(false)}>
                Cancel
              </Button>
            </div>
          </Dialog>
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
          />
          

          <NewsComponent newsData={filteredData} toggleBookmark={toggleBookmark} />
        </div>
      </div>
    </MantineProvider>
  );
}
