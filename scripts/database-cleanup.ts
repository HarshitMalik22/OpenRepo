import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // 1. Safe data integrity check (read-only)
    console.log('🔍 Checking data integrity...');
    
    // Check tables exist and count records
    const tableStats: Record<string, number> = {};
    
    // Core tables
    tableStats.users = await prisma.user.count();
    tableStats.repositories = await prisma.repository.count();
    
    // Optional tables with error handling
    const optionalTables = [
      'userInteraction', 'savedRepository', 'aiAnalysis', 
      'popularRepository', 'recommendationCache', 'communityStats'
    ];
    
    for (const tableName of optionalTables) {
      try {
        const model = prisma[tableName as keyof typeof prisma] as any;
        tableStats[tableName] = await model.count();
      } catch (error) {
        tableStats[tableName] = 0;
        console.log(`  ⚠️ ${tableName} table not accessible`);
      }
    }
    
    console.log('📊 Current table statistics:');
    Object.entries(tableStats).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} rows`);
    });

    // 2. Clean up expired cache entries
    console.log('\n🔍 Cleaning up expired cache entries...');
    
    const expiredRecommendationCache = await prisma.recommendationCache.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    console.log(`🗑️ Cleaned up ${expiredRecommendationCache.count} expired recommendation cache entries`);

    const expiredAiAnalyses = await prisma.aiAnalysis.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    console.log(`🗑️ Cleaned up ${expiredAiAnalyses.count} expired AI analyses`);

    // 3. Clean up old community stats (keep only last 30 days)
    console.log('\n🔍 Cleaning up old community stats...');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldCommunityStats = await prisma.communityStats.deleteMany({
      where: {
        date: {
          lt: thirtyDaysAgo
        }
      }
    });
    
    console.log(`🗑️ Cleaned up ${oldCommunityStats.count} old community stats entries`);

    // 4. Check for duplicate repositories (simplified check)
    console.log('\n🔍 Checking for duplicate repositories...');
    
    const allRepositories = await prisma.repository.findMany({
      select: {
        fullName: true
      }
    });
    
    const nameCounts = allRepositories.reduce((acc, repo) => {
      acc[repo.fullName] = (acc[repo.fullName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const duplicates = Object.entries(nameCounts).filter(([_, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log(`⚠️ Found ${duplicates.length} repositories with potential duplicates`);
      duplicates.forEach(([name, count]) => {
        console.log(`  - ${name}: ${count} occurrences`);
      });
    } else {
      console.log('✅ No duplicate repositories found');
    }

    // 5. Check for incomplete user profiles
    console.log('\n🔍 Checking for incomplete user profiles...');
    
    // Find user profiles that don't have corresponding users
    const allUserProfiles = await prisma.userProfile.findMany({
      include: {
        user: true
      }
    });
    
    const incompleteProfiles = allUserProfiles.filter(profile => !profile.user);
    
    if (incompleteProfiles.length > 0) {
      console.log(`🗑️ Found ${incompleteProfiles.length} incomplete user profiles`);
      // Delete profiles without users
      await prisma.userProfile.deleteMany({
        where: {
          id: {
            in: incompleteProfiles.map(p => p.id)
          }
        }
      });
      console.log('✅ Cleaned up incomplete user profiles');
    } else {
      console.log('✅ No incomplete user profiles found');
    }

    // 6. Final database statistics
    console.log('\n📊 Final Database Statistics:');
    const finalStats: Record<string, number> = {};
    
    // Core tables that should exist
    finalStats.users = await prisma.user.count();
    finalStats.repositories = await prisma.repository.count();
    
    // Optional tables with error handling
    const tablesToCheck = [
      'userInteraction', 'savedRepository', 'aiAnalysis', 
      'popularRepository', 'recommendationCache', 'communityStats'
    ];
    
    for (const tableName of tablesToCheck) {
      try {
        const model = prisma[tableName as keyof typeof prisma] as any;
        finalStats[tableName] = await model.count();
      } catch (error) {
        finalStats[tableName] = 0;
      }
    }
    
    Object.entries(finalStats).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} rows`);
    });

    console.log('\n✅ Database cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupDatabase()
  .then(() => {
    console.log('\n🎉 Cleanup process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error);
    process.exit(1);
  });
