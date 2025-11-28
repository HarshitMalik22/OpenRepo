'use client'

import { UserButton as ClerkUserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function UserButton() {
  const pathname = usePathname() || ''
  
  return (
    <div className="flex items-center gap-4">
      {!pathname.includes("/profile") && (
        <Link
          href="/profile"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Profile
        </Link>
      )}
      <ClerkUserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: 'h-9 w-9',
            userButtonPopoverCard: 'bg-card border border-border',
            userPreviewMainIdentifier: 'text-foreground',
            userPreviewSecondaryIdentifier: 'text-muted-foreground',
            userButtonPopoverActionButtonText: 'text-foreground',
            userButtonPopoverActionButtonIcon: 'text-muted-foreground',
            userButtonPopoverFooter: 'hidden',
          },
        }}
      />
    </div>
  )
}
