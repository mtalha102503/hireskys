import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { Client } from "typesense";

function getTypesenseClient() {
  return new Client({
    nodes: [{
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: 443,
      protocol: "https",
    }],
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY!,
    connectionTimeoutSeconds: 5,
  });
}

const handler = createMcpHandler((server) => {
  // TOOL 1: Search Jobs
  server.registerTool(
    "search_jobs",
    {
      title: "Search Jobs",
      description: "Search remote jobs on HireSkys by keyword, category, location, job type, or experience level",
      inputSchema: {
        query: z.string().describe("Job title or keyword, e.g. 'React developer' or 'HR Generalist'"),
        category: z.string().optional().describe("e.g. Development, Design, Marketing, Legal & HR"),
        location: z.string().optional().describe("e.g. 'Remote (Philippines)' or 'Remote'"),
        job_type: z.string().optional().describe("e.g. Full-time, Part-time, Contract"),
        experience_level: z.string().optional().describe("e.g. Entry-Level, Mid-Level, Senior"),
      },
    },
    async ({ query, category, location, job_type, experience_level }: {
  query: string;
  category?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
}) => {
      let filters: string[] = ["approved:=true", "active:=true"];
      if (category) filters.push(`category:=${category}`);
      if (location) filters.push(`location:=${location}`);
      if (job_type) filters.push(`job_type:=${job_type}`);
      if (experience_level) filters.push(`experience_level:=${experience_level}`);
      const typesenseClient = getTypesenseClient();
      const results = await typesenseClient
        .collections("jobs")
        .documents()
        .search({
          q: query || "*",
          query_by: "title,tags,company",
          filter_by: filters.join(" && "),
          sort_by: "date_posted_ts:desc",
          per_page: 10,
        });

      const jobs = results.hits?.map((hit: any) => ({
  title: hit.document.title,
  company: hit.document.company,
  category: hit.document.category,
  location: hit.document.location,
  job_type: hit.document.job_type,
  experience_level: hit.document.experience_level,
  salary_range: hit.document.salary_range,
  link: `https://www.hireskys.com/jobs/${hit.document.slug}`,
}));

      return {
  content: [{ type: "text" as const, text: JSON.stringify(jobs, null, 2) }],
};
    }
  );

  // TOOL 2: Search Companies
  server.registerTool(
    "search_companies",
    {
      title: "Search Companies",
      description: "Search remote-hiring companies on HireSkys by name, industry, or location",
      inputSchema: {
        query: z.string().describe("Company name or keyword, e.g. 'Open Energy Transition' or 'CleanTech'"),
        industry: z.string().optional().describe("e.g. CleanTech, Energy & Utilities"),
        company_size: z.string().optional().describe("e.g. '51 - 200 Employees'"),
      },
    },
    async ({ query, industry, company_size }: {
  query: string;
  industry?: string;
  company_size?: string;
}) => {
      let filters: string[] = [];
      if (industry) filters.push(`industry:=${industry}`);
      if (company_size) filters.push(`company_size:=${company_size}`);
     const typesenseClient = getTypesenseClient();
      const results = await typesenseClient
        .collections("companies")
        .documents()
        .search({
          q: query || "*",
          query_by: "name,industry",
          filter_by: filters.join(" && "),
          per_page: 10,
        });

      const companies = results.hits?.map((hit: any) => ({
        name: hit.document.name,
        description: hit.document.description,
        website: hit.document.website,
        location: hit.document.location,
        industry: hit.document.industry,
        founded_year: hit.document.founded_year,
        company_size: hit.document.company_size,
        active_jobs_count: hit.document.active_jobs_count,
      }));

      return {
  content: [{ type: "text" as const, text: JSON.stringify(companies, null, 2) }],
};
    }
  );
});

export { handler as GET, handler as POST };
