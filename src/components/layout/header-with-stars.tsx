import { getGitHubRepoDetails } from '@/lib/github';
import Header from './header';

export default async function HeaderWithStars() {
    let stars = 0;
    try {
        const repo = await getGitHubRepoDetails('HarshitMalik22/OpenRepo');
        stars = repo.stargazers_count;
    } catch (error) {
        console.error('Failed to fetch repo details:', error);
    }

    return <Header stars={stars} />;
}
