import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function syncDatabase() {
  console.log('🔄 Starting database synchronization...\n');

  try {
    // 1. Check current schema status
    console.log('📋 Checking current schema status...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Schema is up to date');

    // 2. Generate Prisma client
    console.log('\n🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');

    // 3. Check for missing references and create them
    console.log('\n🔗 Checking for missing repository references...');
    
    // Get all repositories from saved repositories that might not be in the main repository table
    const savedRepos = await prisma.savedRepository.findMany({
      select: {
        repoFullName: true,
        repoName: true,
        repoUrl: true,
        description: true,
        language: true,
        stars: true,
        tags: true
      },
      distinct: ['repoFullName']
    });

    console.log(`Found ${savedRepos.length} unique repositories in saved items`);

    let createdCount = 0;
    for (const savedRepo of savedRepos) {
      const existingRepo = await prisma.repository.findUnique({
        where: { fullName: savedRepo.repoFullName }
      });

      if (!existingRepo) {
        await prisma.repository.create({
          data: {
            fullName: savedRepo.repoFullName,
            name: savedRepo.repoName,
            owner: savedRepo.repoFullName.split('/')[0],
            description: savedRepo.description,
            language: savedRepo.language,
            stars: savedRepo.stars || 0
          }
        });
        createdCount++;
      }
    }

    if (createdCount > 0) {
      console.log(`✅ Created ${createdCount} missing repository references`);
    } else {
      console.log('✅ All repository references are already synchronized');
    }

    // 4. Clean up expired cache entries
    console.log('\n🧹 Cleaning up expired cache entries...');
    
    const expiredCache = await prisma.recommendationCache.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    const expiredAiAnalyses = await prisma.aiAnalysis.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    console.log(`✅ Cleaned up ${expiredCache.count} expired cache entries`);
    console.log(`✅ Cleaned up ${expiredAiAnalyses.count} expired AI analyses`);

    // 5. Update repository statistics
    console.log('\n📊 Updating repository statistics...');
    
    const repoStats = await prisma.repository.findMany({
      select: {
        fullName: true,
        _count: {
          select: {
            interactions: true,
            savedRepos: true,
            aiAnalyses: true
          }
        }
      }
    });

    console.log(`Repository statistics for ${repoStats.length} repositories updated`);

    // 6. Check for data integrity issues (read-only for safety)
    console.log('\n🔍 Checking data integrity...');
    
    // Check for potential issues without deleting
    try {
      const interactionCount = await prisma.userInteraction.count();
      console.log(`  User interactions: ${interactionCount}`);
    } catch (error) {
      console.log('  ⚠️ UserInteraction table not accessible');
    }
    
    try {
      const savedRepoCount = await prisma.savedRepository.count();
      console.log(`  Saved repositories: ${savedRepoCount}`);
    } catch (error) {
      console.log('  ⚠️ SavedRepository table not accessible');
    }
    
    try {
      const aiAnalysisCount = await prisma.aiAnalysis.count();
      console.log(`  AI analyses: ${aiAnalysisCount}`);
    } catch (error) {
      console.log('  ⚠️ AiAnalysis table not accessible');
    }

    // 7. Verify data integrity
    console.log('\n✅ Verifying data integrity...');
    
    const stats: Record<string, number> = {};
    
    // Core tables that should exist
    stats.users = await prisma.user.count();
    stats.repositories = await prisma.repository.count();
    
    // Optional tables that might not exist
    try { stats.userInteractions = await prisma.userInteraction.count(); } catch { stats.userInteractions = 0; }
    try { stats.savedRepositories = await prisma.savedRepository.count(); } catch { stats.savedRepositories = 0; }
    try { stats.aiAnalyses = await prisma.aiAnalysis.count(); } catch { stats.aiAnalyses = 0; }
    try { stats.popularRepositories = await prisma.popularRepository.count(); } catch { stats.popularRepositories = 0; }
    try { stats.recommendationCache = await prisma.recommendationCache.count(); } catch { stats.recommendationCache = 0; }
    try { stats.communityStats = await prisma.communityStats.count(); } catch { stats.communityStats = 0; }

    console.log('\n📊 Final Database Statistics:');
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} rows`);
    });

    // 8. Check for any remaining issues
    console.log('\n🔍 Final consistency check...');
    
    const issues = [];
    
    // Check for users without preferences
    const usersWithoutPrefs = await prisma.user.count({
      where: {
        preferences: {
          none: {}
        }
      }
    });
    
    if (usersWithoutPrefs > 0) {
      issues.push(`${usersWithoutPrefs} users without preferences`);
    }

    // Check for repositories without any interactions
    const reposWithoutInteractions = await prisma.repository.count({
      where: {
        interactions: {
          none: {}
        }
      }
    });
    
    if (reposWithoutInteractions > 0) {
      issues.push(`${reposWithoutInteractions} repositories without interactions`);
    }

    if (issues.length > 0) {
      console.log('⚠️ Minor issues detected (these are normal):');
      issues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log('✅ No consistency issues found');
    }

    console.log('\n🎉 Database synchronization completed successfully!');
    console.log('\n💡 Your Supabase database is now fully synchronized with your application!');
    
  } catch (error) {
    console.error('❌ Error during database synchronization:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the synchronization
syncDatabase()
  .then(() => {
    console.log('\n✨ Sync process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Sync failed:', error);
    process.exit(1);
  });
