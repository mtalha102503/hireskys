import ATSLandingPage from '../ats/page';

// ats.hireskys.com ki root (/) andar se is page par rewrite hoti hai
// (middleware dekho). Content wohi ATS landing hai — farq sirf itna hai
// ke is route ki apni SEO pehchan (layout.tsx) subdomain ke naam par hai,
// jabke www.hireskys.com/ats bilkul waisa ka waisa rehta hai.
export default function ATSHomePage() {
  return <ATSLandingPage />;
}
