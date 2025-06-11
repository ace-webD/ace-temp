import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
        Oops! The page you are looking for does not exist.
      </p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        It might have been moved or deleted.
      </p>      <Link href="/" className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
        Go Back Home
      </Link>
    </div>
  );
}