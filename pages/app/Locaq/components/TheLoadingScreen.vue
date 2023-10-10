<template>
  <div>
    <transition name="fade">
      <div id="loading-screen" class="loading-screen">
        <div class="loading">
          <div class="loading-img">
            <img src="~assets/images/ycommLogo.svg" alt="">
          </div>
          <div class="loading-text">
            <span v-for="(char,i) in 'LOCAQ'" :key="i">{{ char }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup name="TheLoadingScreen">
</script>