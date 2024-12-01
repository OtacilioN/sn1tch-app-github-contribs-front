// app/api/projeto/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const Resumo = z.object({
  summary: z.array(
    z.object({
      userEmail: z.string(),
      userSummary: z.string(),
    })
  ),
});

export async function POST(request: Request) {
  const { gitData, driveData } = await request.json();

  if (!gitData) {
    return NextResponse.json({ error: "Data é obrigatório" }, { status: 400 });
  }

  try {
    const openAi = new OpenAI({ apiKey: process.env.AI_TOKEN });
    const completion = await openAi.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Faça um resumo das contribuições de cada aluno do projeto a partir dos emails e mensagens de commit",
        },
        {
          role: "user",
          content: `Dados obtidos do git:
${gitData
  .map(
    (item: any) => `email: ${item.email}, messagem de commit: ${item.message}`
  )
  .join("\n")}
  
Dados do drive:

${driveData}
  `,
        },
      ],
      response_format: zodResponseFormat(Resumo, "event"),
    });
    const summary = completion.choices[0].message.parsed;

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("Erro ao utilizar inteligência artificial:", error);
    return NextResponse.json(
      { error: "Erro ao utilizar inteligência artificial" },
      { status: 500 }
    );
  }
}
