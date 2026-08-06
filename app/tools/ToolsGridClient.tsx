import Link from 'next/link';
import Image from 'next/image';

interface Tool {
  name: string;
  slug: string;
  category: string;
  description: string;
  pricing_model: string;
  logo_url: string;
}

interface ToolsGridProps {
  tools: Tool[];
  categories: string[];
  activeCategory: string;
}

export default function ToolsGridClient({ tools, categories, activeCategory }: ToolsGridProps) {
  const allCategories = ['All', ...categories];

  return (
    <div>
      {/* Category Filter Pills — real links now, each one a crawlable URL */}
      <div className="flex flex-wrap gap-3 mb-10">
        {allCategories.map((category) => {
          const isActive = activeCategory === category;
          const href = category === 'All' ? '/tools' : `/tools?category=${encodeURIComponent(category)}`;

          return (
            <Link
              key={category}
              href={href}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-[#111827] text-white dark:bg-white dark:text-black shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-[#151b2b] dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-800'
              }`}
            >
              {category}
            </Link>
          );
        })}
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link href={`/tools/${tool.slug}`} key={tool.slug}>
              <div className="group bg-white dark:bg-[#151b2b] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#4F46E5] dark:hover:border-[#6366f1] hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-[#4F46E5] bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
                    {tool.category}
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-full">
                    {tool.pricing_model}
                  </span>
                </div>

                {tool.logo_url && (
                  <div className="w-14 h-14 mb-4 relative bg-white border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-2">
                    <Image
                      src={tool.logo_url}
                      alt={`${tool.name} logo`}
                      fill
                      sizes="56px"
                      className="object-contain p-2"
                    />
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-2 group-hover:text-[#4F46E5] dark:group-hover:text-[#6366f1] transition-colors">
                  {tool.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-sm leading-relaxed">
                  {tool.description}
                </p>

                <div className="mt-6 flex items-center text-[#4F46E5] dark:text-[#6366f1] font-semibold text-sm">
                  View Details & Demo &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">No tools found for this category.</p>
      )}
    </div>
  );
}