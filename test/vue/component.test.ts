import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Ok from '../../components/ok.vue'

test('ok component', async () => {
  const component = mount(Ok, { props: { msg: "hello world!" } })
  expect(component.text()).toMatchInlineSnapshot(
    '"hi: hello world!"',
  )
})