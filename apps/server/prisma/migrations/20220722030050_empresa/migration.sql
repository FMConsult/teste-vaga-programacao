-- CreateTable
CREATE TABLE "cadastroEmpresa" (
    "id" SERIAL NOT NULL,
    "cnpj" TEXT NOT NULL,
    "nomeDaEmpressa" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,

    CONSTRAINT "cadastroEmpresa_pkey" PRIMARY KEY ("id")
);
