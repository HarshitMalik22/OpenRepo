# Database Maintenance Guide

This guide provides comprehensive scripts and instructions for maintaining your Supabase database health and synchronization.

## 📋 Overview

Your OpenSauce application uses a sophisticated database schema with caching, user interactions, AI analyses, and repository data. Regular maintenance ensures optimal performance and data consistency.

## 🚀 Quick Start

### 1. Health Check
Run this first to understand your current database state:

```bash
npm run db:health
```

### 2. Full Synchronization
Run this to sync your database with the current schema and clean up data:

```bash
npm run db:sync
```

### 3. Cleanup Only
Run this to remove orphaned data and expired cache entries:

```bash
npm run db:cleanup
```

## 📊 Database Scripts

### Database Health Check (`database-health-check.ts`)

**Purpose**: Comprehensive analysis of database health, performance, and data consistency.

**What it checks**:
- Database connectivity
- Table counts and accessibility
- Data consistency (orphaned records, missing relationships)
- Performance indicators (large tables, indexing needs)
- Cache efficiency and freshness
- Data freshness indicators

**When to run**:
- Before making major changes
- Periodically (weekly/monthly)
- When experiencing performance issues

### Database Synchronization (`database-sync.ts`)

**Purpose**: Full synchronization between your Prisma schema and Supabase database.

**What it does**:
- Pushes latest schema changes
- Generates Prisma client
- Creates missing repository references
- Cleans expired cache entries
- Updates repository statistics
- Removes orphaned data
- Verifies data integrity

**When to run**:
- After schema changes
- After major code updates
- When deploying to production
- Periodically (weekly)

### Database Cleanup (`database-cleanup.ts`)

**Purpose**: Targeted cleanup of orphaned data and expired entries.

**What it cleans**:
- Orphaned user interactions
- Orphaned saved repositories
- Orphaned AI analyses
- Expired cache entries
- Old community stats
- Incomplete user profiles

**When to run**:
- Daily (automated)
- When cache seems bloated
- After user cleanup operations

## 🔧 Setup

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "db:health": "tsx scripts/database-health-check.ts",
    "db:sync": "tsx scripts/database-sync.ts", 
    "db:cleanup": "tsx scripts/database-cleanup.ts"
  }
}
```

Install required dependency:
```bash
npm install tsx --save-dev
```

## 📈 Maintenance Schedule

### Daily (Automated)
```bash
npm run db:cleanup
```

### Weekly
```bash
npm run db:health
npm run db:sync
```

### Monthly
```bash
npm run db:health
npm run db:sync
# Review performance metrics
# Consider archiving old data
```

### After Major Changes
```bash
npm run db:health
npm run db:sync
```

## 🚨 Common Issues and Solutions

### 1. Schema Mismatch
**Symptoms**: Build errors, runtime errors
**Solution**: 
```bash
npm run db:sync
```

### 2. Performance Issues
**Symptoms**: Slow queries, timeouts
**Solution**:
```bash
npm run db:health
# Review large tables and indexing
```

### 3. Cache Bloat
**Symptoms**: Large database size, slow cache operations
**Solution**:
```bash
npm run db:cleanup
```

### 4. Orphaned Data
**Symptoms**: Missing relationships, inconsistent data
**Solution**:
```bash
npm run db:sync
```

## 📊 Database Schema Overview

### Core Tables
- **User**: User accounts and profiles
- **Repository**: GitHub repository data
- **UserInteraction**: User activity tracking
- **SavedRepository**: User-saved repositories

### AI & Analysis Tables
- **AiAnalysis**: AI-generated content
- **RepositoryAnalysis**: Repository analysis results
- **RecommendationCache**: Performance caching

### Advanced Features
- **UserProfile**: Enhanced user profiling
- **TechnicalSkill**: User skills tracking
- **LearningGoal**: User learning objectives
- **Contribution**: Contribution tracking
- **ContributorPortfolio**: Portfolio management
- **ImpactAnalysis**: Contribution impact analysis

### System Tables
- **CommunityStats**: Community statistics
- **PopularRepository**: Popular repository cache
- **SystemConfig**: System configuration

## 🔍 Monitoring

### Key Metrics to Watch
1. **Cache Hit Rate**: Should be >80%
2. **Orphaned Records**: Should be minimal
3. **Table Growth Rates**: Monitor for unexpected growth
4. **Query Performance**: Watch for slow queries

### Health Indicators
- ✅ All tables accessible
- ✅ Minimal orphaned data
- ✅ Cache efficiency >70%
- ✅ Recent data updates
- ✅ No consistency issues

## 🛡️ Backup Recommendations

### Before Major Operations
1. Export your database
2. Test scripts in development
3. Have rollback plan ready

### Automated Backups
- Enable Supabase automated backups
- Regular exports to external storage
- Test restore procedures

## 📝 Best Practices

1. **Regular Maintenance**: Run cleanup scripts regularly
2. **Monitor Performance**: Use health checks to identify issues early
3. **Schema Consistency**: Keep Prisma schema and database in sync
4. **Cache Management**: Regular cleanup of expired entries
5. **Data Quality**: Monitor for orphaned or inconsistent data

## 🆘 Troubleshooting

### Script Fails
1. Check database connection
2. Verify environment variables
3. Check Prisma schema validity
4. Review error messages carefully

### Performance Issues
1. Run health check to identify bottlenecks
2. Consider indexing large tables
3. Archive old data if needed
4. Review query patterns

### Data Inconsistency
1. Run full synchronization
2. Check for missing relationships
3. Verify data integrity
4. Consider data validation scripts

---

Remember: A healthy database is crucial for application performance and user experience. Regular maintenance prevents issues before they become problems!
