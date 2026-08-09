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
  
  const RATE_WINDOW_MS = 60_000
  const RATE_LIMIT = 30
  
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
  
  const appsRef = db
    .collection('otto')
    .doc('playground')
    .collection('apps')
  
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
  
    const key =
      ip || 'unknown'
  
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
  
      title:
        String(
          data.title || appId,
        ),
  
      kind:
        data.kind,
  
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
    if (
      config.kind === 'counter'
    ) {
      const counts =
        Array.isArray(data.counts)
          ? data.counts
          : []
  
      return {
        counts:
          config.actions.map(
            (
              action,
              index,
            ) => ({
              action,
  
              count:
                safeCount(
                  counts[index],
                ),
            }),
          ),
      }
    }
  
    if (
      config.kind === 'poll'
    ) {
      const votes =
        Array.isArray(data.votes)
          ? data.votes
          : []
  
      return {
        votes:
          config.options.map(
            (
              option,
              index,
            ) => ({
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
  
  function parseAppId(value) {
    const appId =
      String(value || '')
        .trim()
  
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
  
  async function readApp(appId) {
    const appRef =
      appsRef.doc(appId)
  
    const [
      appSnapshot,
      stateSnapshot,
    ] = await Promise.all([
      appRef.get(),
  
      appRef
        .collection('state')
        .doc('main')
        .get(),
    ])
  
    if (
      !appSnapshot.exists ||
      !appSnapshot.get('enabled')
    ) {
      return null
    }
  
    const config =
      publicConfig(
        appSnapshot.id,
        appSnapshot.data(),
      )
  
    return {
      ...config,
  
      state:
        publicState(
          config,
          stateSnapshot.data(),
        ),
    }
  }
  
  async function listApps() {
    const snapshot =
      await appsRef
        .where(
          'enabled',
          '==',
          true,
        )
        .limit(50)
        .get()
  
    return snapshot.docs
      .map((doc) =>
        publicConfig(
          doc.id,
          doc.data(),
        ),
      )
  
      .sort(
        (a, b) =>
          a.appId.localeCompare(
            b.appId,
          ),
      )
  }
  
  async function mutateApp(body) {
    const appId =
      parseAppId(
        body?.appId,
      )
  
    const action =
      String(
        body?.action || '',
      ).trim()
  
    const value =
      typeof body?.value ===
      'string'
        ? body.value.trim()
        : ''
  
    const appRef =
      appsRef.doc(appId)
  
    const stateRef =
      appRef
        .collection('state')
        .doc('main')
  
    return db.runTransaction(
      async (transaction) => {
        const [
          appSnapshot,
          stateSnapshot,
        ] = await Promise.all([
          transaction.get(appRef),
  
          transaction.get(
            stateRef,
          ),
        ])
  
        if (
          !appSnapshot.exists ||
          !appSnapshot.get(
            'enabled',
          )
        ) {
          throw clientError(
            'Playground app not found.',
            404,
          )
        }
  
        if (
          !stateSnapshot.exists
        ) {
          throw clientError(
            'Playground app is not initialized.',
            409,
          )
        }
  
        const config =
          publicConfig(
            appSnapshot.id,
            appSnapshot.data(),
          )
  
        const state =
          stateSnapshot.data() ||
          {}
  
        let nextState
  
        if (
          config.kind ===
          'counter'
        ) {
          const actionIndex =
            config.actions
              .indexOf(action)
  
          if (
            actionIndex === -1
          ) {
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
  
              counts[
                actionIndex
              ] + 1,
            )
  
          nextState = {
            counts,
          }
        } else if (
          config.kind === 'poll'
        ) {
          if (
            action !== 'vote'
          ) {
            throw clientError(
              'Polls only accept the vote action.',
            )
          }
  
          const optionIndex =
            config.options
              .indexOf(value)
  
          if (
            optionIndex === -1
          ) {
            throw clientError(
              'That poll option is not allowed.',
            )
          }
  
          const votes =
            config.options.map(
              (_, index) =>
                safeCount(
                  state.votes?.[
                    index
                  ],
                ),
            )
  
          votes[optionIndex] =
            Math.min(
              MAX_COUNT,
  
              votes[
                optionIndex
              ] + 1,
            )
  
          nextState = {
            votes,
  
            totalVotes:
              Math.min(
                MAX_COUNT,
  
                votes.reduce(
                  (
                    total,
                    count,
                  ) =>
                    total + count,
                  0,
                ),
              ),
          }
        } else if (
          config.kind ===
          'shared-state'
        ) {
          if (
            action !== 'set'
          ) {
            throw clientError(
              'Shared state only accepts the set action.',
            )
          }
  
          const optionIndex =
            config.options
              .indexOf(value)
  
          if (
            optionIndex === -1
          ) {
            throw clientError(
              'That shared-state value is not allowed.',
            )
          }
  
          nextState = {
            currentIndex:
              optionIndex,
  
            changes:
              Math.min(
                MAX_COUNT,
  
                safeCount(
                  state.changes,
                ) + 1,
              ),
          }
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
  
        return {
          ...config,
  
          state:
            publicState(
              config,
              nextState,
            ),
        }
      },
    )
  }
  
  export default async function playground(
    request,
    context,
  ) {
    if (
      request.method ===
      'OPTIONS'
    ) {
      return json({
        ok: true,
      })
    }
  
    if (
      ![
        'GET',
        'POST',
      ].includes(
        request.method,
      )
    ) {
      return fail(
        'Method not allowed.',
        405,
      )
    }
  
    if (
      request.method ===
        'POST' &&
  
      process.env
        .OTTO_PLAYGROUND_WRITES_ENABLED ===
        'false'
    ) {
      return fail(
        'The playground is temporarily read-only.',
        503,
      )
    }
  
    if (
      !checkRateLimit(
        context?.ip,
      )
    ) {
      return fail(
        'Too many playground requests. Try again in a minute.',
        429,
      )
    }
  
    try {
      if (
        request.method ===
        'GET'
      ) {
        const url =
          new URL(
            request.url,
          )
  
        const requestedAppId =
          url.searchParams
            .get('appId')
  
        if (
          !requestedAppId
        ) {
          return json({
            ok: true,
  
            apps:
              await listApps(),
          })
        }
  
        const app =
          await readApp(
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
  
      const contentLength =
        Number(
          request.headers.get(
            'content-length',
          ) || 0,
        )
  
      if (
        contentLength >
        MAX_BODY_BYTES
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
          .length >
        MAX_BODY_BYTES
      ) {
        return fail(
          'Request body is too large.',
          413,
        )
      }
  
      let body
  
      try {
        body =
          JSON.parse(rawBody)
      } catch {
        return fail(
          'Request body must be valid JSON.',
        )
      }
  
      const app =
        await mutateApp(body)
  
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