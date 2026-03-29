/**
 * Parse SC Malaysia Shariah-compliant securities list.
 *
 * The Securities Commission Malaysia publishes a list of
 * Shariah-compliant securities twice a year (May and November).
 * The list is available as a PDF on their website.
 *
 * This is a placeholder — actual PDF parsing will require
 * a PDF parsing library (e.g., pdf-parse) to be added later.
 */
export async function fetchScMalaysiaList(): Promise<string[]> {
  // TODO: Implement PDF download + parsing
  // The SC Malaysia list is published at:
  // https://www.sc.com.my/regulation/guidelines/recognizing-capital-market-products
  //
  // Steps:
  // 1. Fetch the page to find latest PDF link
  // 2. Download PDF
  // 3. Parse table of stock codes from PDF
  // 4. Return array of Bursa Malaysia stock codes

  console.log("[sc-malaysia] PDF parsing not yet implemented — returning empty list");
  return [];
}
