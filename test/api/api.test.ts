import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'

describe('API E2E', () => {
  it('should return success for /api/ok', async () => {
    const res = await $fetch('/api/ok')
    expect(res).toEqual({ success: true })
  })
})
