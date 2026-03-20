import Typesense from 'typesense';

export const typesenseAdminClient = new Typesense.Client({
  nodes: [{
    host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || '', 
    port: 443,
    protocol: 'https'
  }],
  apiKey: process.env.TYPESENSE_ADMIN_KEY || '',
  connectionTimeoutSeconds: 5
});

export const typesenseSearchClient = new Typesense.Client({
  nodes: [{
    host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || '', 
    port: 443,
    protocol: 'https'
  }],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY || '',
  connectionTimeoutSeconds: 10
});