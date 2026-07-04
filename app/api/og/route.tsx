import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // URL se Job Title aur Company ka naam nikalna
    const hasTitle = searchParams.has('title');
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Verified Borderless Remote Job';

    const hasCompany = searchParams.has('company');
    const company = hasCompany ? searchParams.get('company')?.slice(0, 50) : 'HireSkys';

    // Yeh HTML/CSS real-time mein PNG image ban jayega
return new ImageResponse(
(
  <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a', // Dark slate background
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              padding: '60px 80px',
              borderRadius: '20px',
              border: '2px solid #334155',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '20px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#94a3b8',
                marginBottom: '40px',
              }}
            >
              {company} • Remote
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#3b82f6', // Blue button
                color: 'white',
                padding: '15px 40px',
                borderRadius: '12px',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              View on HireSkys
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630, // Standard Open Graph image dimensions
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}