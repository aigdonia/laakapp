/**
 * Job Logger — buffers log lines and flushes to R2 as JSONL.
 */

export interface LogEntry {
  ts: string;
  level: "info" | "warn" | "error";
  msg: string;
}

export class JobLogger {
  private lines: LogEntry[] = [];

  info(msg: string) {
    this.lines.push({ ts: new Date().toISOString(), level: "info", msg });
  }

  warn(msg: string) {
    this.lines.push({ ts: new Date().toISOString(), level: "warn", msg });
  }

  error(msg: string) {
    this.lines.push({ ts: new Date().toISOString(), level: "error", msg });
  }

  toJsonl(): string {
    return this.lines.map((l) => JSON.stringify(l)).join("\n");
  }

  get entries(): LogEntry[] {
    return this.lines;
  }

  get errorCount(): number {
    return this.lines.filter((l) => l.level === "error").length;
  }

  async flush(bucket: R2Bucket, key: string): Promise<void> {
    if (this.lines.length === 0) return;
    await bucket.put(key, this.toJsonl(), {
      httpMetadata: { contentType: "application/x-ndjson" },
    });
  }
}
