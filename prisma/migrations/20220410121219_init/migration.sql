-- AlterTable
CREATE SEQUENCE "token_id_seq";
ALTER TABLE "Token" ALTER COLUMN "id" SET DEFAULT nextval('token_id_seq');
ALTER SEQUENCE "token_id_seq" OWNED BY "Token"."id";

-- AlterTable
CREATE SEQUENCE "user_id_seq";
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE "user_id_seq" OWNED BY "User"."id";
