import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { client, urlFor } from "../sanityClient";

const POSTS_PER_PAGE = 9; // 3 columns x 3 rows

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function BlogList() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post"] | order(publishedAt desc){
          title, slug, excerpt, mainImage, publishedAt
        }`
      )
      .then(setPosts)
      .catch((err) => setError(err.message));
  }, []);

  // Reset to page 1 if the underlying data changes
  useEffect(() => {
    setPage(1);
  }, [posts?.length]);

  const rest = posts && posts.length > 0 ? posts.slice(1) : [];
  const totalPages = Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return rest.slice(start, start + POSTS_PER_PAGE);
  }, [rest, currentPage]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-space text-lg text-text">Couldn't load posts</p>
        <p className="mt-2 text-sm text-text/60">{error}</p>
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-16">
        <div className="h-12 w-56 animate-pulse rounded-lg bg-text/10" />
        <div className="mt-6 h-4 w-80 animate-pulse rounded bg-text/10" />
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] rounded-xl bg-text/10" />
              <div className="mt-4 h-3 w-20 rounded bg-text/10" />
              <div className="mt-3 h-5 w-full rounded bg-text/10" />
              <div className="mt-2 h-5 w-2/3 rounded bg-text/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-space text-xl text-text">Nothing published yet</p>
        <p className="mt-2 text-text/60 font-inter">
          New posts will show up here as soon as they're written.
        </p>
      </div>
    );
  }

  const featured = posts[0];

  const goToPage = (n) => {
    const next = Math.min(Math.max(n, 1), totalPages);
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-5xl px-6 pt-40 pb-16">
        <h1 className="font-space text-5xl md:text-6xl font-medium tracking-tight text-text">
          Journal
        </h1>
        <p className="mt-4 max-w-md font-inter text-text/60">
          Real talk, real workouts, real results. The FitMom Club Family blog covers everything busy households need to know about fitness, nutrition, and wellness for moms, dads, and kids alike. No fluff, no guilt, just practical tips that fit real family life. 
        </p>
      </div>

      {/* Featured post — only on page 1 */}
      {currentPage === 1 && (
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to={`/blogs/${featured.slug.current}`}
            className="group grid gap-8 md:grid-cols-2 items-center border-t border-text/10 py-10"
          >
            {featured.mainImage && (
              <div className="overflow-hidden rounded-2xl bg-text/5 aspect-[4/3]">
                <img
                  src={urlFor(featured.mainImage).width(900).height(675).url()}
                  alt={featured.title}
                  loading="eager"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <div>
              <span className="font-inter text-sm font-medium text-primary-orange">
                {formatDate(featured.publishedAt)}
              </span>
              <h2 className="mt-3 font-space text-3xl md:text-4xl font-medium leading-tight text-text transition-colors group-hover:text-primary-orange">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mt-4 font-inter text-text/65 leading-relaxed">
                  {featured.excerpt}
                </p>
              )}
              <span className="mt-5 inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-text underline decoration-primary-orange decoration-2 underline-offset-4">
                Read post
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8h10m0 0L9 4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Post grid — always 3 per row on desktop */}
      {paginated.length > 0 && (
        <div
          className={`mx-auto max-w-5xl px-6 pb-16 ${
            currentPage === 1 ? "border-t border-text/10" : ""
          }`}
        >
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 pt-12">
            {paginated.map((post) => (
              <Link
                key={post.slug.current}
                to={`/blogs/${post.slug.current}`}
                className="group flex flex-col"
              >
                <div className="overflow-hidden rounded-xl bg-text/5 aspect-[4/3]">
                  {post.mainImage ? (
                    <img
                      src={urlFor(post.mainImage).width(500).height(375).url()}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-space text-sm text-text/30">
                      No image
                    </div>
                  )}
                </div>
                <span className="mt-4 block font-inter text-xs font-medium text-primary-green">
                  {formatDate(post.publishedAt)}
                </span>
                <h3 className="mt-2 font-space text-xl font-medium leading-snug text-text transition-colors group-hover:text-primary-orange">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 font-inter text-sm text-text/60 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mx-auto max-w-5xl px-6 pb-24">
          <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-2 font-inter text-sm"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-text/15 text-text transition-colors hover:border-text/40 disabled:opacity-30 disabled:hover:border-text/15"
              aria-label="Previous page"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13 8H3m0 0l4-4M3 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goToPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  n === currentPage
                    ? "bg-text text-bg font-semibold"
                    : "text-text/60 hover:bg-text/10"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-text/15 text-text transition-colors hover:border-text/40 disabled:opacity-30 disabled:hover:border-text/15"
              aria-label="Next page"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10m0 0l-4-4m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}