import { PAGE_CONTAINER_CLASS } from '@/lib/layout'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className="min-h-screen bg-primary-light">
      <div className={`${PAGE_CONTAINER_CLASS} ${className}`.trim()}>
        {children}
      </div>
    </main>
  )
}
