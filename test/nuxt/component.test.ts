import { test, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { Ok } from '#components'

test('ok component', async () => {
  const component = await mountSuspended(Ok, { props: { msg: "hello world!" } })
  expect(component.text()).toMatchInlineSnapshot(
    '"hi: hello world!"',
  )
})

