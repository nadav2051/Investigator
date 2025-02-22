import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIAnalysis {
  summary: string;
  overallSentiment: number;
  postAnalyses: {
    text: string;
    sentiment: number;
    explanation: string;
  }[];
}

class GoogleAIService {
  private genAI: GoogleGenerativeAI;
  private model: any; // TODO: Add proper type when available

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.NEXT_PRIVATE_GOOGLE_AI_STUDIO_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async analyzeRedditPosts(posts: { title: string; text: string }[]): Promise<AIAnalysis> {
    const prompt = `
      Analyze the following Reddit posts about a stock. For each post:
      1. Determine the sentiment (score from -1 to 1, where -1 is very bearish and 1 is very bullish)
      2. Provide a brief explanation of why you assigned that sentiment score

      Then, provide:
      1. An overall summary of the sentiment across all posts
      2. A general sentiment score (-1 to 1) that represents the collective sentiment

      Here are the posts to analyze:
      ${posts.map((post, i) => `
        Post ${i + 1}:
        Title: ${post.title}
        Text: ${post.text}
      `).join('\n')}

      Please format your response in the following JSON structure:
      {
        "summary": "Your overall summary here",
        "overallSentiment": number between -1 and 1,
        "postAnalyses": [
          {
            "text": "post title/text",
            "sentiment": number between -1 and 1,
            "explanation": "why this sentiment score was assigned"
          }
        ]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse the JSON response
      try {
        const analysis = JSON.parse(response);
        return analysis as AIAnalysis;
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const googleAI = new GoogleAIService(); 