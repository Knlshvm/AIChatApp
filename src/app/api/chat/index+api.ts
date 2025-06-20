import OpenAI from "openai";
import blobToBase64 from "@/utils/helper";

const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.token,
});

// export function GET(request: Request) {
//   return Response.json({ hello: "world" });
// }

// export async function POST(request: Request) {
//   const { messages, previousResponseId } = await request.json();

//   try {
//     const response = await openai.chat.completions.create({
//       messages: messages.map((msg: any) => ({
//         role: msg.role,
//         content: String(msg.content),
//       })),
//       model: "openai/gpt-4o",
//       temperature: 1,
//       max_tokens: 4096,
//       top_p: 1,
//     });

//     console.log(response);

//     return Response.json({
//       responseMessage: response.choices[0].message.content,
//     });
//   } catch (error) {
//     console.log(error);
//     return Response.json(
//       { error: "Failed to generate response" },
//       { status: 500 }
//     );
//   }
// }

const HF_API_TOKEN = process.env.NSCALE_API_KEY;

export async function POST(request: Request) {
  const { messages, generateImage } = await request.json();

  if (generateImage) {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: messages[0].content }),
      }
    );



    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Hugging Face Error:", errorBody);
      return Response.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = `data:image/png;base64,${Buffer.from(
      imageBuffer
    ).toString("base64")}`;

    return Response.json({ generatedImage: base64Image });
  }

  try {
    const formattedMessages = messages.map((msg: any) => {
      if (msg.imageBase64) {
        return {
          role: msg.role,
          content: [
            { type: "text", text: msg.content },
            {
              type: "image_url",
              image_url: {
                url: msg.imageBase64, 
              },
            },
          ],
        };
      } else {
        return {
          role: msg.role,
          content: msg.content,
        };
      }
    });

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: formattedMessages,
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    return Response.json({
      responseMessage: response.choices[0].message.content,
      responseId: response.id,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
