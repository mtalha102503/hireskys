import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const hasTitle = searchParams.has('title');
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Verified Borderless Remote Job';

    const hasCompany = searchParams.has('company');
    const company = hasCompany ? searchParams.get('company')?.slice(0, 50) : 'HireSkys';

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
            backgroundColor: '#0f172a',
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
            {/* 👇 YEH NAYA LOGO ADD KIYA HAI 👇 */}
            <img
              src="https://www.hireskys.com/logo2.png" // Agar logo2 use karna hai to naam change kar lena
              width="80"
              height="80"
              style={{ 
                marginBottom: '20px', 
                borderRadius: '16px', // Agar logo square hai to thora gol ho jayega
                objectFit: 'contain' 
              }}
            />
            {/* 👆 BAS YEH BLOCK ADD HUA HAI 👆 */}

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
                backgroundColor: '#3b82f6',
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
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
