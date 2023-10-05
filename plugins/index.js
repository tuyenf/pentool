import { defineNuxtPlugin } from '#app'
import _ from 'lodash'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            _: () => _
        }
    }
})