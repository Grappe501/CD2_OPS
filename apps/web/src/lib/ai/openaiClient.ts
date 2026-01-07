import OpenAI from "openai";

export function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY missing");
  return new OpenAI({ apiKey: key });
}

export function isOpenAIEnabled() {
  return String(process.env.ENABLE_OPENAI || "").toLowerCase() === "true";
}

export function modelPrimary() {
  return process.env.OPENAI_MODEL_PRIMARY || "gpt-4.1-mini";
}

export function modelFallback() {
  return process.env.OPENAI_MODEL_FALLBACK || modelPrimary();
}

export function requireApproval() {
  return String(process.env.AI_SUGGESTIONS_REQUIRE_APPROVAL || "true").toLowerCase() === "true";
}
