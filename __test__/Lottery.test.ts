import Button from '@/components/Button/index.vue'

import { shallowMount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
// 测试分组
describe('Button', () => {
    // mount
    test('Buttons slot text', () => {
        // @vue/test-utils
        const wrapper = shallowMount(Button, {
            slots: {
                default: 'Button',
            },
        })
        // 断言
        expect(wrapper.text()).toBe('Button')
    })
    test('Button click', () => {
        const wrapper = shallowMount(Button)
        wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeTruthy()
    })
    test('Button disabled', () => {
        const wrapper = shallowMount(Button, {
            props: {
                disabled: true,
            },
        })
        wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeFalsy()
    })
    test('Button not disabled', () => {
        const wrapper = shallowMount(Button, {
            props: {
                disabled: false,
            },
        })
        wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeTruthy()
    })
})
