<template>
  <div>
    <nuxt-link to="/app/bezier">Bezier</nuxt-link>
    <router-view/>
  </div>
</template>
<script lang="ts" setup>
const router = useRouter()
router.push('app/bezier')
</script>
