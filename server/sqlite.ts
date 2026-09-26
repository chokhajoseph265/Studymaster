import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

// Embedded SQLite Database Manager for offline backups and local exports
export class SqliteManager {
  private static instance: SqliteManager | null = null;
  private db: any = null;
  private dbFilePath = path.join(process.cwd(), 'data', 'studymaster.sqlite');

  private constructor() {}

  public static async getInstance(): Promise<SqliteManager> {
    if (!SqliteManager.instance) {
      SqliteManager.instance = new SqliteManager();
      await SqliteManager.instance.init();
    }
    return SqliteManager.instance;
  }

  private async init() {
    const SQL = await initSqlJs();
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(this.dbFilePath)) {
      const fileBuffer = fs.readFileSync(this.dbFilePath);
      this.db = new SQL.Database(fileBuffer);
    } else {
      this.db = new SQL.Database();
      this.initTables();
      this.saveToFile();
    }
  }

  private initTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        forms TEXT,
        icon TEXT,
        description TEXT,
        topicCount INTEGER DEFAULT 0,
        status TEXT DEFAULT 'published'
      );

      CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        subjectId TEXT NOT NULL,
        title TEXT NOT NULL,
        form TEXT NOT NULL,
        term TEXT DEFAULT 'Term 1',
        description TEXT,
        orderIndex INTEGER DEFAULT 1,
        isPremiumOnly INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        subjectId TEXT NOT NULL,
        topicId TEXT NOT NULL,
        title TEXT NOT NULL,
        contentMarkdown TEXT NOT NULL,
        author TEXT,
        readTimeMinutes INTEGER DEFAULT 5,
        audioUrl TEXT,
        videoUrl TEXT,
        pdfUrl TEXT,
        diagramUrl TEXT,
        isPremiumOnly INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        userId TEXT,
        username TEXT NOT NULL,
        studentPhone TEXT,
        planId TEXT NOT NULL,
        amountMWK INTEGER NOT NULL,
        method TEXT NOT NULL,
        transactionRef TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt TEXT
      );
    `);
  }

  public saveToFile() {
    if (this.db) {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbFilePath, buffer);
    }
  }

  public query(sql: string, params: any[] = []) {
    if (!this.db) return [];
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const results: any[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  public execute(sql: string, params: any[] = []) {
    if (!this.db) return;
    this.db.run(sql, params);
    this.saveToFile();
  }

  public getExportBuffer(): Buffer {
    if (!this.db) return Buffer.from([]);
    const data = this.db.export();
    return Buffer.from(data);
  }
}
