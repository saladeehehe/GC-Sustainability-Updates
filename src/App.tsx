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
import { convertToDate } from './utils/dateUtils'; // Import the date utility function
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
    try {
      setLoading(true);
      // Convert date strings to Date objects
      const newsData = (newsDataJson as any[]).map(article => ({
        ...article,
        date: convertToDate(article.date)
      })) as NewsArticle[];
      setNewsData(newsData);
      setSources(extractSources(newsData));
      setFilteredData(newsData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Apply both source and date range filters
    const filtered = newsData.filter(article => {
      // Convert article.date and dateRange to Date objects for comparison
      const articleName = article.title;
      const articleDate = new Date(article.date);
      const startDate = dateRange[0] ? new Date(dateRange[0]) : null;
      const endDate = dateRange[1] ? new Date(dateRange[1]) : null;
    
      // Log the values to debug
      console.log(`Article Name: ${articleName}`);
      console.log(`Article Date: ${articleDate}`);
      console.log(`Start Date: ${startDate}`);
      console.log(`End Date: ${endDate}`);
    
      // Check if the article date is within the specified range
      const withinDateRange = startDate && endDate
        ? articleDate >= startDate && articleDate <= endDate
        : true;
      console.log(`Within Date Range: ${withinDateRange}`);
    
      // Check if the article source matches the selected sources
      const matchesSource = selectedSources.length
        ? selectedSources.includes(article.source)
        : true;
      console.log(`Matches Source: ${matchesSource}`);
    
      // Return true if the article meets both criteria
      return withinDateRange && matchesSource;
    });
    

    setFilteredData(filtered);
  }, [newsData, selectedSources, dateRange]);

  const handleFilterChange = (selectedSources: string[]) => {
    setSelectedSources(selectedSources);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange([startDate, endDate]);
    console.log("From App.tsx, start date: ", startDate);
    console.log("From App.tsx, end date: ", endDate);
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
          {<ColorSchemeToggle />}
          <NewsComponent newsData={filteredData} />
        </div>
      </div>
    </MantineProvider>
  );
}
