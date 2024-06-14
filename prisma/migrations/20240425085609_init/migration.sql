-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifyOTP" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerifyOTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentUploads" (
    "documentUid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadTimestamp" TIMESTAMP(3) NOT NULL,
    "processingTimestamp" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "DocumentUploads_pkey" PRIMARY KEY ("documentUid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerifyOTP_email_key" ON "VerifyOTP"("email");

-- AddForeignKey
ALTER TABLE "DocumentUploads" ADD CONSTRAINT "DocumentUploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
