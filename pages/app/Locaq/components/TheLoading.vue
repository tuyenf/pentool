<template>
  <div class="loading-block" :style="{'min-height': min + 'px'}">
    <div class="lds-spinner" :class="[`spinner-${color}`]">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script lang="ts" setup name="TheLoading">
import { defineProps } from 'vue'
interface IProps {
  color?: string,
  min?: number
}
const props = withDefaults(defineProps<IProps>(), {
  color: 'primary', // 'secondary'
})
</script>

<style lang="scss">
.loading-block {
  min-height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &.loading-sm {
    min-height: 52rem;
    .lds-spinner {
      top: -40px;
    }

  }
}
.lds-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 30%;
  left: 30%;
  transform: translate(-50%, -50%);
  &.spinner-primary {
    div:after {
      background-color: #FB973B;
    }
  }
  &.spinner-secondary {
    div:after {
      background-color: #282626;
    }
  }
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 22px;
  left: 37px;
  width: 3px;
  height: 10px;
  border-radius: 20%;
  background: var(--bs-primary);
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.loader {
  width: 28px;
  height: 28px;
  border: 3px solid;
  border-color: var(--bs-primary) transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  -webkit-animation: rotation 1s linear infinite;
  -o-animation: rotation 1s linear infinite;
  animation: rotation 1s linear infinite;
  &-btn {
    width: 20px;
    height: 20px;
    border: 3px solid;
    margin-right: 1rem;
    border-color: #fff transparent;
    &-sm {
      width: 14px;
      height: 14px;
      border: 2px solid;
      margin-right: 0.5rem;
      border-color: var(--bs-primary) transparent;
    }

  }
  &-sm {
    width: 15px;
    height: 15px;
    border: 2px solid;
    margin-right: 1rem;
    border-color: #fff transparent;
  }
  &-btn-2 {
    width: 20px;
    height: 20px;
    border: 3px solid;
    margin: 0;
    border-color: var(--bs-body-color) transparent;
  }
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loader-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.loader-2 {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: block;
  margin: 10px auto;
  position: relative;
  background: #FFF;
  box-shadow: -20px 0 #FFF, 20px 0 #FFF;
  box-sizing: border-box;
  -webkit-animation: shadowPulse 1.5s ease-in-out infinite;
  -moz-animation: shadowPulse 1.5s ease-in-out infinite;
  -o-animation: shadowPulse 1.5s ease-in-out infinite;
  animation: shadowPulse 1.5s ease-in-out infinite;
}
.loader-orange {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: block;
  margin: 10px auto;
  position: relative;
  background: #FFF;
  box-shadow: -20px 0 #FFF, 20px 0 #FFF;
  box-sizing: border-box;
  -webkit-animation: shadowPulse2 1.5s ease-in-out infinite;
  -moz-animation: shadowPulse2 1.5s ease-in-out infinite;
  -o-animation: shadowPulse2 1.5s ease-in-out infinite;
  animation: shadowPulse2 1.5s ease-in-out infinite;
}

@keyframes shadowPulse {
  33% {
    background: #FFF;
    box-shadow: -20px 0 var(--bs-primary), 20px 0 #FFF;
  }
  66% {
    background: var(--bs-primary);
    box-shadow: -20px 0 #FFF, 20px 0 #FFF;
  }
  100% {
    background: #FFF;
    box-shadow: -20px 0 var(--bs-primary), 20px 0 var(--bs-primary);
  }
}
@keyframes shadowPulse2 {
  33% {
    background: #FFF;
    box-shadow: -20px 0 #FB973B, 20px 0 #FFF;
  }
  66% {
    background: #FB973B;
    box-shadow: -20px 0 #FFF, 20px 0 #FFF;
  }
  100% {
    background: #FFF;
    box-shadow: -20px 0 #FB973B, 20px 0 #FB973B;
  }
}
#loading-screen {
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #fff, $alpha: .9);
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }

  .loading-img {
    width: 8rem;
    margin-bottom: 1.6rem;
    -webkit-animation: bound 2.5s infinite ease-in-out;
    -o-animation: bound 2.5s infinite ease-in-out;
    animation: bound 2.5s infinite ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loading-brand-text {
    letter-spacing: 8px;
    font-size: 16px;
    font-weight: 600;
    @for $i from 0 through 10 {
      &:nth-child(#{$i + 1}) {
        filter: blur(0px);
        -webkit-animation: blur-text 1s calc(#{$i/10}) + s infinite linear alternate;
        -o-animation: blur-text 1s calc(#{$i/10}) + s infinite linear alternate;
        animation: blur-text 1s calc(#{$i/10}) + s infinite linear alternate;
      }
    }
  }
.loading-text {
  width: fit-content;
  span {
    display: inline-block;
    margin: 0 5px;
    color: #282626;
    @for $i from 0 through 10 {
      &:nth-child(#{$i + 1}) {
        filter: blur(0px);
         animation: blur-text 1s calc($i/10) + s infinite linear alternate;
      }
    }
  }
}

  @keyframes blur-text {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.3);
    }
  }

  @keyframes bound {
    0% {
      transform: rotateY(0);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
}

.loading {
  &-overlay {
    background-color: rgb(0,0,0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    z-index: 999;
    &-mobile {
      display: none;
    }
  }
}
.reload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.7);
}

.loader-reload {
  transform: scale(0.5);
  width: 18px;
  height: 18px;
  border: 3px solid var(--bs-body-color);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  -webkit-animation: rotation-reload 1s linear infinite;;
  -o-animation: rotation-reload 1s linear infinite;;
  animation: rotation-reload 1s linear infinite;;
}
.loader-reload::after {
  content: '';
  position: absolute;
  box-sizing: border-box;
  left: 6px;
  top: 9px;
  border: 4px solid transparent;
  border-right-color: var(--bs-body-color);
  -webkit-transform: rotate(-50deg);
  -moz-transform: rotate(-50deg);
  -ms-transform: rotate(-50deg);
  -o-transform: rotate(-50deg);
  transform: rotate(-50deg);
}

@keyframes rotation-reload {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/**
 * ==============================================
 * Dot Typing
 * ==============================================
 */
.dot-typing {
  position: relative;
  left: -9994px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: gray;
  color: gray;
  box-shadow: 9984px 0 0 0 gray, 9994px 0 0 0 gray, 10004px 0 0 0 gray;
  -webkit-animation: dotTyping 1.5s infinite linear;
  -o-animation: dotTyping 1.5s infinite linear;
  animation: dotTyping 1.5s infinite linear;
}

@keyframes dotTyping {
  0% {
    box-shadow: 9984px 0 0 0 gray, 9994px 0 0 0 gray, 10004px 0 0 0 gray;
  }
  16.667% {
    box-shadow: 9984px -10px 0 0 gray, 9994px 0 0 0 gray, 10004px 0 0 0 gray;
  }
  33.333% {
    box-shadow: 9984px 0 0 0 gray, 9994px 0 0 0 gray, 10004px 0 0 0 gray;
  }
  50% {
    box-shadow: 9984px 0 0 0 gray, 9994px -10px 0 0 gray, 10004px 0 0 0 gray;
  }
  66.667% {
    box-shadow: 9984px 0 0 0 gray, 9994px 0 0 0 gray, 10004px 0 0 0 gray;
  }
  83.333% {
    box-shadow: 9984px 0 0 0 gray, 9994px 0 0 0 gray, 10004px -10px 0 0 gray;
  }
  100% {
    box-shadow: 9984px 0 0 0 gray, 9994px 0 0 0 gray, 10004px 0 0 0 gray;
  }
}

</style>
