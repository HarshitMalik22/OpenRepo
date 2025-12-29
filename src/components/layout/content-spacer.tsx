'use client';

import { usePathname } from 'next/navigation';

export default function ContentSpacer() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    if (isHome) return null;

    return <div className="h-20 md:h-24" />;
}
