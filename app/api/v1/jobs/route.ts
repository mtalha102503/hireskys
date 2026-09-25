// app/api/v1/jobs/route.ts
import { NextResponse } from 'next/server';
import { typesenseSearchClient } from '@/lib/typesenseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Optional API Key Authentication Check
    const apiKey = request.headers.get('x-api-key') || searchParams.get('api_key');
    const validApiKey = process.env.HIRESKYS_API_KEY;

    if (validApiKey && apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing API key.' },
        { status: 401 }
      );
    }

    // 2. Extract Query Parameters
    const query = searchParams.get('q') || '*';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '50', 10), 250); // Max 250 per page
    const category = searchParams.get('category');
    const location = searchParams.get('location');

    // 3. Build Search Parameters
    // 3. Build Search Parameters (description removed from query_by)
    const searchParameters: any = {
      q: query,
      query_by: 'title,company,tags,category', // 'description' hata diya yahan se
      sort_by: 'date_posted_ts:desc,created_at:desc',
      page: page,
      per_page: perPage,
      filter_by: 'active:true && approved:true',
    };

    if (category) {
      searchParameters.filter_by += ` && category:=${category}`;
    }
    if (location) {
      searchParameters.filter_by += ` && location:=${location}`;
    }

    // 4. Fetch Data using typesenseSearchClient
    const searchResults = await typesenseSearchClient
      .collections('jobs')
      .documents()
      .search(searchParameters);

    // 5. Format JSON Response
    const jobs = searchResults.hits?.map((hit: any) => {
      const doc = hit.document;
      return {
        id: doc.id,
        title: doc.title,
        company: doc.company,
        company_logo_url: doc.company_logo_url,
        category: doc.category,
        location: doc.location,
        job_type: doc.job_type,
        experience_level: doc.experience_level,
        salary_range: doc.salary_range,
        tags: doc.tags || [],
        country_codes: doc.country_codes || [],
        link: doc.link,
        date_posted: doc.date_posted,
        created_at: doc.created_at,
        description: doc.description,
      };
    });

    return NextResponse.json(
      {
        success: true,
        page: searchResults.page,
        per_page: searchParameters.per_page,
        total_jobs: searchResults.found,
        total_pages: Math.ceil((searchResults.found || 0) / perPage),
        data: jobs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Typesense API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch job records from Typesense.',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}