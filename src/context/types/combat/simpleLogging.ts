/**
 * Simple log entry for combat systems
 */
export interface SimpleLogEntry {
  timestamp: number;
  message: string;
  type: string;
  importance: "normal" | "high";
}
