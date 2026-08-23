import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Remote Jobs in Claude & ChatGPT | HireSkys MCP',
  description: 'Connect the HireSkys Model Context Protocol (MCP) server to your AI assistant. Search thousands of remote jobs, summarize requirements, and write cover letters directly inside Claude and ChatGPT.',
  keywords: [
    // 🚀 Primary Target Keywords
    'Model Context Protocol',
    'MCP Server',
    'Claude Desktop MCP',
    'ChatGPT job search',
    
    // 🎯 Use-Case Based Keywords
    'AI job search',
    'Find remote jobs with AI',
    'Write cover letter with AI',
    'Automate job search',
    
    // 🛠️ Tech & Integration Keywords
    'HireSkys MCP',
    'Claude custom connector',
    'Claude AI tools',
    'ChatGPT custom actions',
    'Remote job board API'
  ],
  authors: [{ name: 'HireSkys' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Search Remote Jobs in Claude & ChatGPT | HireSkys MCP',
    description: 'Connect the HireSkys MCP server to your AI assistant. Search thousands of remote jobs and verify companies directly inside your chat.',
    url: 'https://www.hireskys.com/mcp',
    siteName: 'HireSkys',
    images: [
      {
        // 🖼️ Make sure you have a cool image here in your public folder
        url: '/blog-mcp-guide.jpg', 
        width: 1200,
        height: 630,
        alt: 'HireSkys MCP Integration for Claude and ChatGPT',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Remote Jobs in Claude & ChatGPT | HireSkys MCP',
    description: 'Connect the HireSkys MCP server to your AI assistant. Search remote jobs directly inside Claude and ChatGPT.',
    creator: '@hireskys', // Apne twitter handle se replace kar dena agar hai
    images: ['/blog-mcp-guide.jpg'],
  },
  alternates: {
    canonical: 'https://www.hireskys.com/mcp',
  },
};

export default function McpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}