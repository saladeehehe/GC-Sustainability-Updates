import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Welcome } from "./Welcome/Welcome";
import NewsComponent from "./Components/newsComponent.tsx";
import { NavbarMinimal } from "./Components/NavBarMinimal.tsx";
import { ColorSchemeToggle } from "./ColorSchemeToggle/ColorSchemeToggle";
import { useState, useEffect } from 'react';
import newsDataJson from '../public/news_data.json'; // Import the JSON file
import { NewsArticle } from './Components/newsComponent.ts'; // Adjust path based on your project structure
import './App.css'; // Ensure this is where you put the .mainContent styles

// Extract sources from the news data
const extractSources = (newsData: NewsArticle[]): string[] => {
  const sourcesSet = new Set(newsData.map(article => article.source));
  return Array.from(sourcesSet);
};

export default function App() {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<NewsArticle[]>(newsData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      const newsData = newsDataJson as NewsArticle[];
      setNewsData(newsData);
      setSources(extractSources(newsData));
      setFilteredData(newsData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (selectedSources: string[]) => {
    if (selectedSources.length === 0) {
      setFilteredData(newsData); // Show all data if no filter is selected
    } else {
      const filtered = newsData.filter(article => selectedSources.includes(article.source));
      setFilteredData(filtered);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <MantineProvider theme={theme}>
      <div className="grid-container">
        <div className="navbar">
          <NavbarMinimal sources={sources} onFilterChange={handleFilterChange}/>
        </div>
        <div className="main-content">
          <Welcome />
          <ColorSchemeToggle />
          <NewsComponent newsData={filteredData}/>
        </div>
      </div>
    </MantineProvider>
  );
}
