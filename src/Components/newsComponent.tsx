// src/components/NewsComponent.tsx
import React from 'react';
import { NewsArticle } from './newsComponent.ts';
import { Grid, Paper, Text, Anchor } from '@mantine/core';

interface NewsComponentProps {
  newsData: NewsArticle[];
}

const NewsComponent: React.FC<NewsComponentProps> = ({ newsData }) => {
  return (
    <Grid grow style={{ padding: '20px' }}>
      {newsData.map((article) => (
        <Grid.Col span={3} key={article.title} style={{ display: 'flex' }}>
          <Paper shadow="lg" radius="md" style={{ flex: 1,  flexDirection: 'column' }}>
            <Anchor href={article.link} target="_blank" rel="noopener noreferrer" size="lg" mt="sm" fw={600}>
              {article.title}
            </Anchor>
            <Text size="sm" color="dimmed" mt="md">
              {article.summary}
            </Text>
            <Text size="sm" mt="md">
              Date: {article.date}
            </Text>
            <Text size="sm" mt="md">
              Source: {article.source}
            </Text>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default NewsComponent;
