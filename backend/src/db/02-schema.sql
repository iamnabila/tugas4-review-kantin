    USE review_kantin;
    CREATE USER tugas2_praktikum_rsi FOR LOGIN tugas2_praktikum_rsi;
    ALTER ROLE db_datareader ADD MEMBER tugas2_praktikum_rsi;
    ALTER ROLE db_datawriter ADD MEMBER tugas2_praktikum_rsi;