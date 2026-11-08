-- CreateTable
CREATE TABLE "support_requests" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "support_requests_userId_idx" ON "support_requests"("userId");

-- AddForeignKey
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
