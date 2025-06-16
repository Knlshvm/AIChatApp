import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.token,
});

// export function GET(request: Request) {
//   return Response.json({ hello: "world" });
// }

export async function POST(request: Request) {
  const { messages, previousResponseId } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: String(msg.content),
      })),
      model: "openai/gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    console.log(response);

    return Response.json({
      responseMessage: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
