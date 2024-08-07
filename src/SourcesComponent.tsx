
// SourcesComponent.tsx
//import React from 'react';
import { Container, Text, Anchor, List, Divider, Title } from '@mantine/core';

const SourcesComponent = () => {
  return (
    <Container style={{
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px', // Rounds the corners
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adds shadow
    }}>
      <Title order={1}>Sources Information</Title>
      <Text size="lg" mt="md">
        Below is a list of sources used in this project, as well as additional recommended resources for further exploration.
      </Text>

      <Title order={2} mt="lg">Primary Sources</Title>
      <List mt="md">
        <List.Item>
          <Anchor href="https://un-sdg-website.example.com" target="_blank">UN SDG Website</Anchor> - United Nations Sustainable Development Goals.
        </List.Item>
        <List.Item>
          <Anchor href="https://european-chttps://environment.ec.europa.eu/news_en?f%5B0%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/343&f%5B1%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/535&f%5B2%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/1158&f%5B3%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2470&f%5B4%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2530&f%5B5%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2947&f%5B6%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/5482&f%5B7%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_98d1408a&f%5B8%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_749f2ce9&f%5B9%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_1138d9d2&f%5B10%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/ANNOUNC_NEWS&f%5B11%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/PRESS_REL&f%5B12%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/STATommission.example.com" target="_blank">European Commission</Anchor> - European Union's main executive body.
        </List.Item>
        <List.Item>
          <Anchor href="https://www.mse.gov.sg/news/--press-releases/" target="_blank">Ministry of Sustainability and Environment (Singapore)</Anchor> - Singapore's environmental policies and initiatives. (Press release)
        </List.Item>
        <List.Item>
          <Anchor href="https://www.google.com/search?q=latest+sustainability+regulations+singapore&gl=sg&tbm=nws&num=50" target="_blank">Google News (Search "latest sustainability regulations Singapore")</Anchor> - Latest news on sustainability regulations in Singapore.
        </List.Item>
      </List>

      <Divider my="lg" />

      <Title order={2}>Additional Resources</Title>
      <Text mt="md">
        We recommend exploring the following resources for more comprehensive information on sustainability and environmental management.
      </Text>
      
      <Title order={3} mt="lg">International Organizations</Title>
      <List mt="md">
        <List.Item>
          <Anchor href="https://www.iso.org" target="_blank">International Organization for Standardization (ISO)</Anchor> - ISO 14000 series: Standards related to environmental management systems.
        </List.Item>
        <List.Item>
          <Anchor href="https://www.wri.org" target="_blank">World Resources Institute (WRI)</Anchor> and <Anchor href="https://www.wbcsd.org" target="_blank">World Business Council for Sustainable Development (WBCSD)</Anchor> - Greenhouse Gas Protocol: Standards and tools for managing greenhouse gas emissions.
        </List.Item>
      </List>
      
      <Title order={3} mt="lg">Industry-Specific Guidelines</Title>
      <List mt="md">
        <List.Item>
          <Anchor href="https://www.sgx.com/sustainable-finance/sustainability-reporting" target="_blank">Singapore Stock Exchange (SGX)</Anchor> - Sustainability Reporting Guide.
        </List.Item>
        <List.Item>
          <Anchor href="https://www.stb.gov.sg/content/stb/en/assistance-and-licensing/tsp.html" target="_blank">Singapore Tourism Board (STB)</Anchor> - Sustainable Tourism Strategy
        </List.Item>
      </List>
      
      <Title order={3} mt="lg">Additional Sources</Title>
      <List mt="md">
        <List.Item>
          <Anchor href="https://www.wwf.sg/" target="_blank">WWF Singapore</Anchor> and <Anchor href="https://www.sec.org.sg/" target="_blank">Singapore Environment Council (SEC)</Anchor> - Guidelines and advocacy for sustainable practices.
        </List.Item>
        <List.Item>
          <Anchor href="https://www.nus.edu.sg/sustainability/" target="_blank">National University of Singapore (NUS)</Anchor> and <Anchor href="https://www.ntu.edu.sg/sustainability/" target="_blank">Nanyang Technological University (NTU)</Anchor> - Contributions to sustainability research and policy recommendations.
        </List.Item>
      </List>
    </Container>
  );
};

export default SourcesComponent;
