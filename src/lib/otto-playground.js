const ENDPOINT =
  '/api/playground'

async function playgroundRequest(
  url,
  options,
) {
  const response =
    await fetch(
      url,
      options,
    )

  const body =
    await response
      .json()
      .catch(() => null)

  if (
    !response.ok ||
    !body?.ok
  ) {
    throw new Error(
      body?.error ||
      `Playground request failed (${response.status}).`,
    )
  }

  return body
}

function cleanAppId(appId) {
  const value =
    String(
      appId || '',
    ).trim()

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      value,
    )
  ) {
    throw new Error(
      'Invalid playground appId.',
    )
  }

  return value
}

function safeNumber(value) {
  const number =
    Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function normalizePlaygroundApp(
  app,
) {
  if (
    !app ||
    typeof app !== 'object'
  ) {
    return app
  }

  const normalized = {
    ...app,
  }

  if (
    app.kind === 'counter'
  ) {
    const counts =
      Array.isArray(
        app.state?.counts,
      )
        ? app.state.counts
        : []

    normalized.counts =
      Object.fromEntries(
        counts
          .filter(
            (item) =>
              typeof item?.action ===
              'string',
          )
          .map(
            (item) => [
              item.action,
              safeNumber(
                item.count,
              ),
            ],
          ),
      )
  }

  if (
    app.kind === 'poll'
  ) {
    const votes =
      Array.isArray(
        app.state?.votes,
      )
        ? app.state.votes
        : []

    normalized.votes =
      Object.fromEntries(
        votes
          .filter(
            (item) =>
              typeof item?.option ===
              'string',
          )
          .map(
            (item) => [
              item.option,
              safeNumber(
                item.votes,
              ),
            ],
          ),
      )

    normalized.totalVotes =
      safeNumber(
        app.state?.totalVotes,
      )
  }

  if (
    app.kind ===
    'shared-state'
  ) {
    normalized.value =
      String(
        app.state?.value ??
        '',
      )

    normalized.changes =
      safeNumber(
        app.state?.changes,
      )
  }

  return normalized
}

export async function listPlaygroundApps() {
  const body =
    await playgroundRequest(
      ENDPOINT,
    )

  return body.apps
}

export async function getPlaygroundApp(
  appId,
) {
  const safeAppId =
    cleanAppId(appId)

  const body =
    await playgroundRequest(
      `${ENDPOINT}?appId=${encodeURIComponent(
        safeAppId,
      )}`,
    )

  return normalizePlaygroundApp(
    body.app,
  )
}

export async function performPlaygroundAction(
  appId,
  action,
  value,
) {
  const safeAppId =
    cleanAppId(appId)

  const body =
    await playgroundRequest(
      ENDPOINT,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          appId: safeAppId,
          action,

          ...(value === undefined
            ? {}
            : {
                value,
              }),
        }),
      },
    )

  return normalizePlaygroundApp(
    body.app,
  )
}

export function watchPlaygroundApp(
  appId,
  onUpdate,
  onError = console.error,
  intervalMs = 10_000,
) {
  const safeInterval =
    Math.max(
      5_000,
      Number(intervalMs) ||
      10_000,
    )

  let stopped = false
  let timer

  async function refresh() {
    try {
      const app =
        await getPlaygroundApp(
          appId,
        )

      if (!stopped) {
        onUpdate(app)
      }
    } catch (error) {
      if (!stopped) {
        onError(error)
      }
    } finally {
      if (!stopped) {
        timer =
          window.setTimeout(
            refresh,
            safeInterval,
          )
      }
    }
  }

  refresh()

  return () => {
    stopped = true

    window.clearTimeout(
      timer,
    )
  }
}