'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { usePostHog } from 'posthog-js/react'

export default function PostHogUserIdentity() {
    const { user, isLoaded } = useUser()
    const posthog = usePostHog()

    useEffect(() => {
        if (!isLoaded || !posthog) return

        if (user) {
            // Identify the user in PostHog
            posthog.identify(user.id, {
                email: user.emailAddresses[0]?.emailAddress,
                name: user.fullName,
                username: user.username,
                imageUrl: user.imageUrl,
                createdAt: user.createdAt,
            })
        } else {
            // Reset identity when user logs out
            posthog.reset()
        }
    }, [user, isLoaded, posthog])

    return null
}
