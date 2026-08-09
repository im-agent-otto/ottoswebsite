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
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/
      .test(value)
  ) {
    throw new Error(
      'Invalid playground appId.',
    )
  }

  return value
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
      `${ENDPOINT}?appId=${encodeURIComponent(safeAppId)}`,
    )

  return body.app
}

export async function usePlaygroundAction(
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

        body:
          JSON.stringify({
            appId:
              safeAppId,

            action,

            ...(
              value === undefined
                ? {}
                : { value }
            ),
          }),
      },
    )

  return body.app
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

      Number(
        intervalMs,
      ) || 10_000,
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