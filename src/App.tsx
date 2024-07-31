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
import './App.css'; // Ensure this is where you put the .mainContent styles

const extractSources = (newsData: NewsArticle[]): string[] => {
  const sourcesSet = new Set(newsData.map(article => article.source));
  return Array.from(sourcesSet);
};

export default function App() {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/news_data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch news data');
        }
        const data = await response.json();
        const newsData = data.map((article: any) => ({
          ...article,
          date: convertToDate(article.date)
        })) as NewsArticle[];

        // Sort news data by date in descending order
        newsData.sort((a, b) => b.date.getTime() - a.date.getTime());

        setNewsData(newsData);
        setSources(extractSources(newsData));
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
    // Apply both source and date range filters
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

      return withinDateRange && matchesSource;
    });

    setFilteredData(filtered);
  }, [newsData, selectedSources, dateRange]);

  const handleFilterChange = (selectedSources: string[]) => {
    setSelectedSources(selectedSources);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange([startDate, endDate]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <MantineProvider theme={theme}>
      <div className="grid-container">
        <div className="navbar">
          <NavbarMinimal sources={sources} onFilterChange={handleFilterChange} onDateRangeChange={handleDateRangeChange} />
        </div>
        <div className="main-content">
          <Welcome />
          <ColorSchemeToggle />
          <NewsComponent newsData={filteredData} />
        </div>
      </div>
    </MantineProvider>
  );
}
