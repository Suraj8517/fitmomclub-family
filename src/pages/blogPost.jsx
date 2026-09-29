import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { client, urlFor } from "../sanityClient";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// Rough reading time from Portable Text blocks
const estimateReadingTime = (blocks = []) => {
  const words = blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text).join(" "))
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const portableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-space text-2xl md:text-3xl font-medium text-text mt-12 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-space text-xl md:text-2xl font-medium text-text mt-10 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="font-inter text-lg leading-relaxed text-text/80 mb-6">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary-orange pl-6 my-8 font-space text-xl text-text italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-orange underline underline-offset-2 hover:text-text transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-text">{children}</strong>
    ),
  },
  types: {
    image: ({ value }) => (
      <img
        src={urlFor(value).width(1000).url()}
        alt={value.alt || ""}
        className="rounded-xl my-10 w-full"
      />
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 font-inter text-lg text-text/80 space-y-2">
        {children}
      </ul>
    ),
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          title, body, mainImage, publishedAt
        }`,
        { slug }
      )
      .then((data) => (data ? setPost(data) : setNotFound(true)))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-space text-xl text-text">Post not found</p>
        <Link
          to="/blogs"
          className="mt-4 inline-block font-inter text-sm text-primary-orange underline underline-offset-4"
        >
          Back to all posts
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center text-text/50 font-inter">
        Loading post…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-2xl px-6 pt-26 pb-24">
        <Link
          to="/blogs"
          className="font-inter text-sm text-text/60 hover:text-text transition-colors"
        >
          ← All posts
        </Link>

        <div className="mt-8 flex items-center gap-5 font-inter text-sm text-text/50">
          <span className="text-primary-orange font-medium">
            {formatDate(post.publishedAt)}
          </span>
          <span>{estimateReadingTime(post.body)} min read</span>
        </div>

        <h1 className="mt-4 font-space text-4xl md:text-5xl font-medium leading-tight text-text">
          {post.title}
        </h1>

        {post.mainImage && (
          <img
            src={urlFor(post.mainImage).width(1200).url()}
            alt={post.title}
            className="mt-10 w-full rounded-2xl"
          />
        )}

        <div className="mt-12">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
      </div>
    </div>
  );
}