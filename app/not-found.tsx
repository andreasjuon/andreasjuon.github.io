import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-primary-light flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  )
}
