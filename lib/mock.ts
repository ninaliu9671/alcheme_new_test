export async function mockExtract(_rawText: string): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 800));
  return [
    "我享受了一个安静又放松的早晨。",
    "我在工作中找到了新的灵感。",
    "我想花更多时间陪伴自己重要的人。",
    "我对未来充满了期待。",
  ];
}
