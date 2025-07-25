import type { DbId } from '@sqlite.org/sqlite-wasm'
import { sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm'
import { ref } from 'vue'

export function useSQLite() {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const isInitialized = ref(false)

  let promiser: ReturnType<typeof sqlite3Worker1Promiser> | null = null
  let dbId: string | null = null

  const databaseConfig = {
  filename: `file:credentials.sqlite3?vfs=opfs`,
  tables: {
    test: {
      credentials: {
        name: 'local_database',
        schema: `
          CREATE TABLE IF NOT EXISTS credentials (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            credential_website TEXT NOT NULL,
            credential_username TEXT NOT NULL,
            credential_password TEXT NOT NULL
          );
        `,
      },
    },
  },
} as const

  async function initialize() {
    if (isInitialized.value) return true

    isLoading.value = true
    error.value = null

    try {
      // Initialize the SQLite worker
      promiser = await new Promise((resolve) => {
        const _promiser = sqlite3Worker1Promiser({
          onready: () => resolve(_promiser),
        })
      })

      if (!promiser) throw new Error('Failed to initialize promiser')

      // Get configuration and open database
      await promiser('config-get', {})
      const openResponse = await promiser('open', {
        filename: databaseConfig.filename,
      })

      if (openResponse.type === 'error') {
        throw new Error(openResponse.result.message)
      }

      dbId = openResponse.result.dbId as string

      // Create initial tables
      for (const table of Object.values(databaseConfig.tables)) {
        if (table.credentials && table.credentials.schema) {
          await promiser('exec', {
            dbId,
            sql: table.credentials.schema,
          })
        }
      }

      isInitialized.value = true
      return true
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    }
    finally {
      isLoading.value = false
    }
  }

  async function executeQuery(sql: string, params: unknown[] = []) {
    if (!dbId || !promiser) {
      await initialize()
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await promiser!('exec', {
        dbId: dbId as DbId,
        sql,
        bind: params,
        returnValue: 'resultRows',
      })

      if (result.type === 'error') {
        throw new Error(result.result.message)
      }

      return result
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error('Query execution failed')
      throw error.value
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    isInitialized,
    executeQuery,
    initialize,
  }
}