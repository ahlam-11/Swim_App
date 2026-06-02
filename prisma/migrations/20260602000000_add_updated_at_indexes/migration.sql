-- Migration: add updatedAt columns and performance indexes
-- Apply with: npx prisma migrate deploy

-- AddColumn: updatedAt on User
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddColumn: updatedAt on TrainingSession
ALTER TABLE "TrainingSession" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex: TrainingSession.userId (FK lookup)
CREATE INDEX "TrainingSession_userId_idx" ON "TrainingSession"("userId");

-- CreateIndex: TrainingSession.createdAt DESC (historique trié)
CREATE INDEX "TrainingSession_createdAt_idx" ON "TrainingSession"("createdAt" DESC);

-- CreateIndex: CompletedLog.userId (FK lookup + stats dashboard)
CREATE INDEX "CompletedLog_userId_idx" ON "CompletedLog"("userId");

-- CreateIndex: CompletedLog.completedAt DESC (séances récentes)
CREATE INDEX "CompletedLog_completedAt_idx" ON "CompletedLog"("completedAt" DESC);
