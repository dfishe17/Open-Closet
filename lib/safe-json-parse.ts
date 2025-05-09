/**
 * Safely parse JSON without using eval
 * @param jsonString The JSON string to parse
 * @returns The parsed JSON object or null if parsing fails
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return null
  }
}
