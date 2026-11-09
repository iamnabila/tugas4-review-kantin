USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'tugas2_praktikum_rsi')
BEGIN
    CREATE LOGIN tugas2_praktikum_rsi WITH PASSWORD = N'GANTI_PASSWORD_KAMU';
END
GO

USE review_kantin;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'tugas2_praktikum_rsi')
BEGIN
    CREATE USER tugas2_praktikum_rsi FOR LOGIN tugas2_praktikum_rsi;
END
GO

ALTER ROLE db_datareader ADD MEMBER tugas2_praktikum_rsi;
ALTER ROLE db_datawriter ADD MEMBER tugas2_praktikum_rsi;
GO
