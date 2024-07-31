import React from 'react';
import { NewsArticle } from './newsComponent';
import { Grid, Paper, Text, Anchor } from '@mantine/core';
import { format } from 'date-fns';

interface NewsComponentProps {
  newsData: NewsArticle[];
}

const NewsComponent: React.FC<NewsComponentProps> = ({ newsData }) => {
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
          <Grid.Col span={4} key={article.title} style={{ display: 'flex'}}>
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
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default NewsComponent;
