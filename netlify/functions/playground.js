import {
  createHash,
} from 'node:crypto'

import {
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app'

import {
  FieldValue,
  getFirestore,
} from 'firebase-admin/firestore'

const APP_ID_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const MAX_BODY_BYTES = 4_096
const MAX_COUNT = 1_000_000_000

const MAX_TEXT_LENGTH = 140
const MAX_RETURNED_ENTRIES = 50

const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 30

const TEXT_RATE_WINDOW_MS = 60_000
const TEXT_RATE_LIMIT = 3

const rateBuckets = new Map()

function getFirebaseApp() {
  const existing = getApps()[0]

  if (existing) {
    return existing
  }

  const rawCredentials =
    process.env
      .FIREBASE_SERVICE_ACCOUNT_JSON

  if (!rawCredentials) {
    throw new Error(
      'Missing FIREBASE_SERVICE_ACCOUNT_JSON.',
    )
  }

  let serviceAccount

  try {
    serviceAccount =
      JSON.parse(rawCredentials)
  } catch {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.',
    )
  }

  return initializeApp({
    credential: cert(serviceAccount),

    projectId:
      process.env.FIREBASE_PROJECT_ID ||
      serviceAccount.project_id,
  })
}

const db =
  getFirestore(getFirebaseApp())

const playgroundRef = db
  .collection('otto')
  .doc('playground')

const appsRef =
  playgroundRef.collection('apps')

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type',

        'Access-Control-Allow-Methods':
          'GET, POST, OPTIONS',

        'Access-Control-Allow-Origin':
          '*',

        'Cache-Control':
          'no-store',

        'Content-Type':
          'application/json; charset=utf-8',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  )
}

function fail(
  message,
  status = 400,
) {
  return json(
    {
      ok: false,
      error: message,
    },
    status,
  )
}

function clientError(
  message,
  status = 400,
) {
  return Object.assign(
    new Error(message),
    {
      expose: true,
      status,
    },
  )
}

function checkRateLimit(ip) {
  const now = Date.now()
  const key = ip || 'unknown'

  const current =
    rateBuckets.get(key)

  if (
    !current ||
    current.resetsAt <= now
  ) {
    rateBuckets.set(
      key,
      {
        count: 1,
        resetsAt:
          now + RATE_WINDOW_MS,
      },
    )

    return true
  }

  if (
    current.count >= RATE_LIMIT
  ) {
    return false
  }

  current.count += 1

  return true
}

function cleanStringArray(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (item) =>
      typeof item === 'string',
  )
}

function safeCount(value) {
  return Number.isSafeInteger(value)
    ? Math.max(
        0,
        Math.min(
          MAX_COUNT,
          value,
        ),
      )
    : 0
}

function publicConfig(
  appId,
  data,
) {
  return {
    appId,

    title: String(
      data.title || appId,
    ),

    kind: data.kind,

    options:
      cleanStringArray(
        data.options,
      ),

    actions:
      cleanStringArray(
        data.actions,
      ),
  }
}

function publicState(
  config,
  data = {},
) {
  if (config.kind === 'counter') {
    const counts = Array.isArray(
      data.counts,
    )
      ? data.counts
      : []

    return {
      counts:
        config.actions.map(
          (action, index) => ({
            action,

            count:
              safeCount(
                counts[index],
              ),
          }),
        ),
    }
  }

  if (config.kind === 'poll') {
    const votes = Array.isArray(
      data.votes,
    )
      ? data.votes
      : []

    return {
      votes:
        config.options.map(
          (option, index) => ({
            option,

            votes:
              safeCount(
                votes[index],
              ),
          }),
        ),

      totalVotes:
        safeCount(
          data.totalVotes,
        ),
    }
  }

  if (
    config.kind ===
    'shared-state'
  ) {
    const index =
      Number.isSafeInteger(
        data.currentIndex,
      )
        ? data.currentIndex
        : 0

    return {
      value:
        config.options[index] ??
        config.options[0] ??
        '',

      changes:
        safeCount(
          data.changes,
        ),
    }
  }

  if (
    config.kind === 'text-board'
  ) {
    return {
      entryCount:
        safeCount(
          data.entryCount,
        ),
    }
  }

  return {}
}

function publicDate(value) {
  if (!value) return null

  if (
    typeof value.toDate ===
    'function'
  ) {
    return value
      .toDate()
      .toISOString()
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return null
}

function publicEntry(doc) {
  return {
    id: doc.id,

    text: String(
      doc.get('text') || '',
    ),

    createdAt:
      publicDate(
        doc.get('createdAt'),
      ),
  }
}

function parseAppId(value) {
  const appId = String(
    value || '',
  ).trim()

  if (
    appId.length < 1 ||
    appId.length > 40 ||
    !APP_ID_PATTERN.test(appId)
  ) {
    throw clientError(
      'Invalid playground appId.',
    )
  }

  return appId
}

function cleanSubmittedText(value) {
  const candidate =
    typeof value === 'string'
      ? value
      : typeof value?.text ===
          'string'
        ? value.text
        : ''

  const text = candidate
    .normalize('NFKC')
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) {
    throw clientError(
      'Text cannot be empty.',
    )
  }

  if (
    Array.from(text).length >
    MAX_TEXT_LENGTH
  ) {
    throw clientError(
      `Text must be ${MAX_TEXT_LENGTH} characters or fewer.`,
    )
  }

  const containsUrl =
    /(?:https?:\/\/|www\.)\S+/i.test(
      text,
    )

  const containsEmail =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(
      text,
    )

  const containsEvmAddress =
    /\b0x[a-f0-9]{40}\b/i.test(
      text,
    )

  const containsLongBase58 =
    /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/.test(
      text,
    )

  if (
    containsUrl ||
    containsEmail ||
    containsEvmAddress ||
    containsLongBase58
  ) {
    throw clientError(
      'Links, contact details, and wallet addresses are not allowed here.',
    )
  }

  return text
}

function hashValue(value) {
  return createHash('sha256')
    .update(String(value))
    .digest('hex')
}

function getClientKey(ip) {
  const secret =
    process.env
      .OTTO_PLAYGROUND_RATE_SECRET ||
    process.env
      .FIREBASE_SERVICE_ACCOUNT_JSON ||
    'otto-playground'

  return hashValue(
    `${secret}:${ip || 'unknown'}`,
  )
}

async function readApp(appId) {
  const appRef =
    appsRef.doc(appId)

  const stateRef = appRef
    .collection('state')
    .doc('main')

  const [
    appSnapshot,
    stateSnapshot,
  ] = await Promise.all([
    appRef.get(),
    stateRef.get(),
  ])

  if (
    !appSnapshot.exists ||
    !appSnapshot.get('enabled')
  ) {
    return null
  }

  const config = publicConfig(
    appSnapshot.id,
    appSnapshot.data(),
  )

  const result = {
    ...config,

    state: publicState(
      config,
      stateSnapshot.data(),
    ),
  }

  if (
    config.kind === 'text-board'
  ) {
    const entriesSnapshot =
      await appRef
        .collection('entries')
        .orderBy(
          'createdAt',
          'desc',
        )
        .limit(
          MAX_RETURNED_ENTRIES,
        )
        .get()

    result.entries =
      entriesSnapshot.docs
        .map(publicEntry)
        .filter(
          (entry) => entry.text,
        )
  }

  return result
}

async function listApps() {
  const snapshot = await appsRef
    .where('enabled', '==', true)
    .limit(50)
    .get()

  return snapshot.docs
    .map((doc) =>
      publicConfig(
        doc.id,
        doc.data(),
      ),
    )
    .sort((a, b) =>
      a.appId.localeCompare(
        b.appId,
      ),
    )
}

async function mutateApp(
  body,
  clientIp,
) {
  const appId = parseAppId(
    body?.appId,
  )

  const action = String(
    body?.action || '',
  ).trim()

  if (
    action.length < 1 ||
    action.length > 40
  ) {
    throw clientError(
      'Invalid playground action.',
    )
  }

  const value =
    typeof body?.value === 'string'
      ? body.value.trim()
      : ''

  const appRef =
    appsRef.doc(appId)

  const stateRef = appRef
    .collection('state')
    .doc('main')

  await db.runTransaction(
    async (transaction) => {
      const appSnapshot =
        await transaction.get(appRef)

      const stateSnapshot =
        await transaction.get(
          stateRef,
        )

      if (
        !appSnapshot.exists ||
        !appSnapshot.get('enabled')
      ) {
        throw clientError(
          'Playground app not found.',
          404,
        )
      }

      if (!stateSnapshot.exists) {
        throw clientError(
          'Playground app is not initialized.',
          409,
        )
      }

      const config = publicConfig(
        appSnapshot.id,
        appSnapshot.data(),
      )

      const state =
        stateSnapshot.data() || {}

      let nextState

      if (config.kind === 'counter') {
        const actionIndex =
          config.actions.indexOf(
            action,
          )

        if (actionIndex === -1) {
          throw clientError(
            'That counter action is not allowed.',
          )
        }

        const counts =
          config.actions.map(
            (_, index) =>
              safeCount(
                state.counts?.[
                  index
                ],
              ),
          )

        counts[actionIndex] =
          Math.min(
            MAX_COUNT,
            counts[actionIndex] + 1,
          )

        nextState = {
          counts,
        }
      } else if (
        config.kind === 'poll'
      ) {
        if (action !== 'vote') {
          throw clientError(
            'Polls only accept the vote action.',
          )
        }

        const optionIndex =
          config.options.indexOf(
            value,
          )

        if (optionIndex === -1) {
          throw clientError(
            'That poll option is not allowed.',
          )
        }

        const votes =
          config.options.map(
            (_, index) =>
              safeCount(
                state.votes?.[index],
              ),
          )

        votes[optionIndex] =
          Math.min(
            MAX_COUNT,
            votes[optionIndex] + 1,
          )

        nextState = {
          votes,

          totalVotes: Math.min(
            MAX_COUNT,
            votes.reduce(
              (total, count) =>
                total + count,
              0,
            ),
          ),
        }
      } else if (
        config.kind ===
        'shared-state'
      ) {
        if (action !== 'set') {
          throw clientError(
            'Shared state only accepts the set action.',
          )
        }

        const optionIndex =
          config.options.indexOf(
            value,
          )

        if (optionIndex === -1) {
          throw clientError(
            'That shared-state value is not allowed.',
          )
        }

        nextState = {
          currentIndex:
            optionIndex,

          changes: Math.min(
            MAX_COUNT,
            safeCount(
              state.changes,
            ) + 1,
          ),
        }
      } else if (
        config.kind === 'text-board'
      ) {
        if (
          action !== 'submit-text'
        ) {
          throw clientError(
            'Text boards only accept the submit-text action.',
          )
        }

        const text =
          cleanSubmittedText(
            body?.value,
          )

        const now = Date.now()

        const clientKey =
          getClientKey(clientIp)

        const rateRef = appRef
          .collection('rateLimits')
          .doc(clientKey)

        const rateSnapshot =
          await transaction.get(
            rateRef,
          )

        const rateData =
          rateSnapshot.data() || {}

        const existingStart =
          Number(
            rateData.windowStartedAtMs,
          ) || 0

        const inCurrentWindow =
          now - existingStart <
          TEXT_RATE_WINDOW_MS

        const currentUses =
          inCurrentWindow
            ? safeCount(
                rateData.count,
              )
            : 0

        if (
          currentUses >=
          TEXT_RATE_LIMIT
        ) {
          throw clientError(
            'Too many text submissions. Try again in a minute.',
            429,
          )
        }

        const textHash =
          hashValue(
            text.toLowerCase(),
          )

        if (
          inCurrentWindow &&
          rateData.lastTextHash ===
            textHash
        ) {
          throw clientError(
            'That message was already submitted.',
            409,
          )
        }

        const entryRef = appRef
          .collection('entries')
          .doc()

        nextState = {
          entryCount: Math.min(
            MAX_COUNT,
            safeCount(
              state.entryCount,
            ) + 1,
          ),
        }

        transaction.set(
          entryRef,
          {
            text,

            createdAt:
              FieldValue
                .serverTimestamp(),
          },
        )

        transaction.set(
          rateRef,
          {
            count:
              currentUses + 1,

            windowStartedAtMs:
              inCurrentWindow
                ? existingStart
                : now,

            lastTextHash:
              textHash,

            updatedAt:
              FieldValue
                .serverTimestamp(),
          },
          {
            merge: true,
          },
        )
      } else {
        throw clientError(
          'Unsupported playground app kind.',
          409,
        )
      }

      transaction.update(
        stateRef,
        {
          ...nextState,

          updatedAt:
            FieldValue
              .serverTimestamp(),
        },
      )
    },
  )

  return readApp(appId)
}

export default async function playground(
  request,
  context,
) {
  if (request.method === 'OPTIONS') {
    return json({
      ok: true,
    })
  }

  if (
    !['GET', 'POST'].includes(
      request.method,
    )
  ) {
    return fail(
      'Method not allowed.',
      405,
    )
  }

  if (
    request.method === 'POST' &&
    process.env
      .OTTO_PLAYGROUND_WRITES_ENABLED ===
      'false'
  ) {
    return fail(
      'The playground is temporarily read-only.',
      503,
    )
  }

  const clientIp =
    context?.ip ||
    request.headers.get(
      'x-nf-client-connection-ip',
    ) ||
    'unknown'

  if (!checkRateLimit(clientIp)) {
    return fail(
      'Too many playground requests. Try again in a minute.',
      429,
    )
  }

  try {
    if (request.method === 'GET') {
      const url = new URL(
        request.url,
      )

      const requestedAppId =
        url.searchParams.get(
          'appId',
        )

      if (!requestedAppId) {
        return json({
          ok: true,
          apps: await listApps(),
        })
      }

      const app = await readApp(
        parseAppId(
          requestedAppId,
        ),
      )

      return app
        ? json({
            ok: true,
            app,
          })
        : fail(
            'Playground app not found.',
            404,
          )
    }

    const contentLength = Number(
      request.headers.get(
        'content-length',
      ) || 0,
    )

    if (
      contentLength > MAX_BODY_BYTES
    ) {
      return fail(
        'Request body is too large.',
        413,
      )
    }

    const rawBody =
      await request.text()

    if (
      new TextEncoder()
        .encode(rawBody)
        .length > MAX_BODY_BYTES
    ) {
      return fail(
        'Request body is too large.',
        413,
      )
    }

    let body

    try {
      body = JSON.parse(rawBody)
    } catch {
      return fail(
        'Request body must be valid JSON.',
      )
    }

    const app = await mutateApp(
      body,
      clientIp,
    )

    return json({
      ok: true,
      app,
    })
  } catch (error) {
    console.error(
      'Playground request failed:',
      error,
    )

    return fail(
      error?.expose
        ? error.message
        : 'Playground request failed.',

      error?.expose
        ? error.status
        : 500,
    )
  }
}

export const config = {
  path: '/api/playground',
}