/**
 * Cleans and parses the raw text returned by the Claude API,
 * stripping markdown fences and recovering JSON from edge-case formats.
 * 
 * @param {string} rawText - The raw response string from Claude
 * @returns {Object} The parsed JSON object
 */
export const parseAIResponse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Invalid raw response text input');
  }

  let cleaned = rawText.trim();

  // Strip markdown code block fences if present
  if (cleaned.startsWith('```')) {
    // Matches ```json <content> ``` or ``` <content> ```
    const match = cleaned.match(/^```(?:json)?([\s\S]*?)```$/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    // Self-healing: If first parse fails, search for the boundary of the first outer JSON object
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const salvaged = cleaned.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(salvaged);
      } catch (salvageError) {
        // Throw descriptive error if salvage attempt also fails
        console.error('AI response salvage failed. Original text:', rawText);
        throw new Error(`Failed to parse AI report JSON: ${salvageError.message}`);
      }
    }

    throw new Error(`Failed to parse AI report JSON: ${parseError.message}`);
  }
};
