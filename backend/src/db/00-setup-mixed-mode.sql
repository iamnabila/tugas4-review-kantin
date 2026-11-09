USE review_kantin;
GO

-- ================================================================= LIKES
IF NOT EXISTS (SELECT 1 FROM dbo.LIKES)
BEGIN
    SET IDENTITY_INSERT dbo.LIKES ON;
    INSERT INTO dbo.LIKES (id, review_id, user_id) VALUES
        (1, 1,  13),
        (2, 4,  13),
        (3, 5,  12),
        (4, 8,  15),
        (5, 11, 14);
    SET IDENTITY_INSERT dbo.LIKES OFF;
    DBCC CHECKIDENT ('dbo.LIKES', RESEED, 5) WITH NO_INFOMSGS;
    PRINT 'Seed LIKES selesai.';
END
GO

-- =========================================================== AUDIT_LOGS
IF NOT EXISTS (SELECT 1 FROM dbo.AUDIT_LOGS)
BEGIN
    SET IDENTITY_INSERT dbo.AUDIT_LOGS ON;
    INSERT INTO dbo.AUDIT_LOGS (id, user_id, action, target_table, target_id, metadata) VALUES
        (1, 1, N'CREATE', N'STALLS',     1, N'{"note":"stall baru ditambahkan"}'),
        (2, 1, N'UPDATE', N'MENU_ITEMS', 3, N'{"field":"price","old":12000,"new":14000}'),
        (3, 2, N'CREATE', N'MENU_ITEMS', 21, N'{"note":"menu baru ditambahkan"}'),
        (4, 1, N'UPDATE', N'FLAGS',      3, N'{"field":"status","old":"pending","new":"resolved"}'),
        (5, 3, N'DELETE', N'REVIEWS',    99, N'{"note":"review dihapus karena spam"}');
    SET IDENTITY_INSERT dbo.AUDIT_LOGS OFF;
    DBCC CHECKIDENT ('dbo.AUDIT_LOGS', RESEED, 5) WITH NO_INFOMSGS;
    PRINT 'Seed AUDIT_LOGS selesai.';
END
GO

SELECT 'LIKES' AS tabel, COUNT(*) AS jumlah FROM dbo.LIKES
UNION ALL SELECT 'AUDIT_LOGS', COUNT(*) FROM dbo.AUDIT_LOGS;
GO