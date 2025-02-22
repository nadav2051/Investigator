import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIAnalysis {
  summary: string;
  overallSentiment: number;
  ticker: string;
  postAnalyses: {
    text: string;
    sentiment: number;
    explanation: string;
  }[];
  filteredPosts?: {
    title: string;
    reason: string;
  }[];
}

class GoogleAIService {
  private genAI: GoogleGenerativeAI;
  private model: any; // TODO: Add proper type when available
  private readonly MAX_WORDS = 500; // Maximum words per post

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.NEXT_PRIVATE_GOOGLE_AI_STUDIO_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private isPostTooLong(post: { title: string; text: string }): boolean {
    const totalWords = this.countWords(post.title) + this.countWords(post.text);
    return totalWords > this.MAX_WORDS;
  }

  async analyzeRedditPosts(posts: { title: string; text: string }[], ticker: string): Promise<AIAnalysis> {
    // Track filtered posts
    const filteredPostsInfo: { title: string; reason: string }[] = [];
    const filteredPosts = posts.filter(post => {
      if (this.isPostTooLong(post)) {
        const words = this.countWords(post.title) + this.countWords(post.text);
        filteredPostsInfo.push({
          title: post.title,
          reason: `Exceeded ${this.MAX_WORDS} word limit (${words} words)`
        });
        return false;
      }
      return true;
    });

    // If no posts remain after filtering, return a default analysis
    if (filteredPosts.length === 0) {
      return {
        summary: "No suitable posts found for analysis (all posts exceeded maximum length).",
        overallSentiment: 0,
        ticker,
        postAnalyses: [],
        filteredPosts: filteredPostsInfo
      };
    }

    const prompt = `
      Analyze these Reddit posts about ${ticker} stock. Focus ONLY on sentiment related to ${ticker}, ignore other tickers mentioned.
      For each post:
      1. Determine the sentiment specifically for ${ticker} (score from -1 to 1, where -1 is very bearish and 1 is very bullish)
      2. Provide a brief explanation (max 100 characters) of why you assigned that sentiment score
      3. If a post doesn't specifically discuss ${ticker}, assign neutral sentiment (0)

      Then, provide:
      1. A brief overall summary (max 200 characters) of ${ticker} sentiment
      2. A general sentiment score (-1 to 1) based ONLY on ${ticker}-related content

      Here are the posts to analyze:
      ${filteredPosts.map((post, i) => `
        Post ${i + 1}:
        Title: ${post.title}
        Text: ${post.text}
      `).join('\n')}

      IMPORTANT: Your response must be valid JSON in exactly this format:
      {
        "summary": "Brief summary here focusing on ${ticker}",
        "overallSentiment": number between -1 and 1,
        "ticker": "${ticker}",
        "postAnalyses": [
          {
            "text": "post title",
            "sentiment": number between -1 and 1,
            "explanation": "brief explanation about ${ticker} sentiment"
          }
        ]
      }

      Keep explanations and summaries concise. Do not include any text before or after the JSON.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean the response
      let cleanedResponse = response.trim();
      
      // Remove markdown code block if present
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\n/, '')
          .replace(/^```\n/, '')
          .replace(/\n```$/, '')
          .trim();
      }
      
      try {
        const analysis = JSON.parse(cleanedResponse);
        
        // Validate the response structure
        if (!analysis.summary || typeof analysis.overallSentiment !== 'number' || !Array.isArray(analysis.postAnalyses) || analysis.ticker !== ticker) {
          throw new Error('Invalid response structure');
        }

        // Ensure all required fields are present and valid
        analysis.postAnalyses.forEach((post: any, index: number) => {
          if (!post.text || typeof post.sentiment !== 'number' || !post.explanation) {
            throw new Error(`Invalid post analysis at index ${index}`);
          }
        });

        // Add filtered posts information to the response
        if (filteredPostsInfo.length > 0) {
          analysis.filteredPosts = filteredPostsInfo;
        }
        
        return analysis as AIAnalysis;
      } catch (error) {
        throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance
export const googleAI = new GoogleAIService(); 