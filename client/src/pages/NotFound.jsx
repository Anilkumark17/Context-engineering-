import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Link to="/" className="underline">Go home</Link>
      </div>
    </div>
  )
}
