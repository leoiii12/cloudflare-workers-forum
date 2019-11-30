export async function sha256Encode(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text)

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hash
}
