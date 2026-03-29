/**
 * Parse ICAP Saudi Shariah-compliant securities list.
 *
 * The International Center for Applied Finance (ICAP) publishes
 * a list of Shariah-compliant securities on the Saudi Exchange (Tadawul).
 *
 * This is a placeholder — actual PDF parsing will require
 * a PDF parsing library to be added later.
 */
export async function fetchIcapSaudiList(): Promise<string[]> {
  // TODO: Implement PDF download + parsing
  // Steps:
  // 1. Fetch the ICAP page to find latest PDF link
  // 2. Download PDF
  // 3. Parse table of Tadawul stock codes from PDF
  // 4. Return array of Tadawul stock codes

  console.log("[icap-saudi] PDF parsing not yet implemented — returning empty list");
  return [];
}
