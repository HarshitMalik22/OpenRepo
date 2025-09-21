import dynamic from 'next/dynamic';

// Dynamically import the repos page content with loading state
const ReposPageContent = dynamic(
  () => import('@/components/repos-page-content'),
  { 
    loading: () => (
      <div className="container mx-auto py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading repositories...</p>
        </div>
      </div>
    )
  }
);

export default function ReposPage() {
  return <ReposPageContent />;
}
