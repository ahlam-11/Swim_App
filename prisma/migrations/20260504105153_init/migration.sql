-- CreateEnum
CREATE TYPE "Level" AS ENUM ('debutant', 'intermediaire', 'avance');

-- CreateEnum
CREATE TYPE "Stroke" AS ENUM ('crawl', 'dos', 'brasse', 'papillon', 'four_nages');

-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('endurance', 'technique', 'vitesse', 'recuperation');

-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('warmup', 'drills', 'main', 'cooldown');

-- CreateEnum
CREATE TYPE "Intensity" AS ENUM ('easy', 'moderate', 'hard', 'sprint');

-- CreateEnum
CREATE TYPE "ExportTarget" AS ENUM ('garmin', 'coros', 'pdf');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('planned', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "level" "Level" NOT NULL DEFAULT 'debutant',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "level" "Level" NOT NULL,
    "stroke" "Stroke" NOT NULL,
    "goal" "Goal" NOT NULL,
    "totalDistance" INTEGER NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "poolLength" INTEGER NOT NULL DEFAULT 25,
    "source" TEXT NOT NULL DEFAULT 'generated',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSet" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "phase" "Phase" NOT NULL,
    "label" TEXT NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "stroke" TEXT NOT NULL,
    "restSeconds" INTEGER NOT NULL DEFAULT 0,
    "intensity" "Intensity" NOT NULL DEFAULT 'moderate',
    "equipment" TEXT,
    "note" TEXT,

    CONSTRAINT "TrainingSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualDuration" INTEGER NOT NULL,
    "actualDistance" INTEGER NOT NULL,
    "notes" TEXT,
    "exportTarget" "ExportTarget",
    "exportedAt" TIMESTAMP(3),

    CONSTRAINT "CompletedLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'planned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduledSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSet" ADD CONSTRAINT "TrainingSet_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedLog" ADD CONSTRAINT "CompletedLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedLog" ADD CONSTRAINT "CompletedLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledSession" ADD CONSTRAINT "ScheduledSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledSession" ADD CONSTRAINT "ScheduledSession_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
