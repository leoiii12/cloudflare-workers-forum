function myBtoa(text: string) {
  return btoa(text)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export async function signJwt(payloadObj: any, secret: string) {
  const headerPart = myBtoa('{"alg":"HS512","typ":"JWT"}')
  const payloadPart = myBtoa(JSON.stringify(payloadObj))

  return _sign(headerPart, payloadPart, secret)
}

export async function verifyJwt(againstJwt: string, secret: string) {
  if (typeof againstJwt !== 'string') {
    return null
  }
  if (typeof secret !== 'string') {
    return null
  }

  const parts = againstJwt.split('.')
  if (parts.length !== 3) {
    return null
  }

  const jwt = await _sign(parts[0], parts[1], secret)
  if (jwt !== againstJwt) {
    return null
  }

  return JSON.parse(atob(parts[1]))
}

async function _sign(headerPart: string, payloadPart: string, secret: string) {
  if (typeof headerPart !== 'string') {
    return null
  }
  if (typeof payloadPart !== 'string') {
    return null
  }
  if (typeof secret !== 'string') {
    return null
  }

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    {
      name: 'HMAC',
      hash: { name: 'SHA-512' },
    },
    false,
    ['sign', 'verify'],
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(`${headerPart}.${payloadPart}`),
  )

  const signaturePart = myBtoa(
    String.fromCharCode(...new Uint8Array(signature)),
  )

  return `${headerPart}.${payloadPart}.${signaturePart}`
}
