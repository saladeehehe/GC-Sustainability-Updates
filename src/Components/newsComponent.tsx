import React from 'react';
import { NewsArticle } from './newsComponent';
import { Grid, Paper, Text, Anchor, Badge, ActionIcon} from '@mantine/core';
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { format } from 'date-fns';

interface NewsComponentProps {
  newsData: NewsArticle[];
  toggleBookmark: (title: string) => void; 
}
const categoryColors: { [key: string]: string } = {
  Carbon: 'green',
  Water: 'blue',
  Energy: 'yellow',
  Material: 'orange',
  'Policies/Acts/Regulations': 'purple',
  Singapore: 'red'
  // Add more categories and their colors here
};


const NewsComponent: React.FC<NewsComponentProps> = ({ newsData, toggleBookmark }) => {
  return (
    <Grid grow style={{ padding: '20px' }}>
      {newsData.map((article) => {
        let formattedDate = 'Invalid date';
        try {
          formattedDate = format(new Date(article.date), 'dd MMM yyyy');
        } catch (error) {
          console.error('Date formatting error:', error);
        }

        return (
          <Grid.Col span={4} key={article.title} style={{ display: 'flex', position:'relative'}}>
            <Paper shadow="lg" radius="md" style={{ flex: 1, flexDirection: 'column' , padding: '10px'}}>
              <Anchor href={article.link} target="_blank" rel="noopener noreferrer" size="lg" mt="sm" fw={600}>
                {article.title}
              </Anchor>
              <Text size="md" color="dimmed" mt='sm'>
                {article.summary}
              </Text>
              <Text size="sm" mt="xs">
                Date: {formattedDate}
              </Text>
              <Text size="sm" >
                Source: {article.source}
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                <Text size="sm" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                  Categories:
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '5px'}}>
                  {article.categories && article.categories.map((category, index) => (
                    <Badge key={index} color={categoryColors[category] || 'gray'} // Fallback color if category not found
                      style={{ marginRight: '5px', marginBottom:'5px'}}>
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <ActionIcon
                onClick={() => toggleBookmark(article.title)}
                style={{ position: 'absolute', 
                bottom: '20px', 
                right: '20px'}}
                variant="outline"
                color={article.bookmarked ? 'red' : 'gray'}
              >
                {article.bookmarked ? <IconBookmarkFilled size={20} /> : <IconBookmark size={20} />}
              </ActionIcon>
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default NewsComponent;
