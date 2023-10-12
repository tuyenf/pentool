<template>
  <div class="tw-p-6">
    <h1 class="tw-font-semibold tw-text-lg">1. Mutiple Select</h1>
    <div>
      <h4 class="tw-mt-2"># Show checkbox</h4>
      <the-multiple-select
          v-model:options="tags"
          :selected-options="selectedOptions"
          @update:selected-options="(newVal) => selectedOptions = newVal"
          :id="'select1'"
          :is-show-check-box="true"
      >
      </the-multiple-select>
      <h4 class="tw-mt-2"># Hide checkbox</h4>
      <the-multiple-select
          v-model:options="tags2"
          :id="'select2'"
          :is-show-check-box="false"
          :selected-options="selectedOptions2"
          @update:selected-options="(newVal) => selectedOptions2 = newVal"
      >
      </the-multiple-select>
      <h4 class="tw-mt-2"># Disable</h4>
      <the-multiple-select
          v-model:options="tags"
          :is-disable="true"
          v-model:selected-options="defaultSelectedOptions"
      >
      </the-multiple-select>
    </div>
    <h1 class="tw-font-semibold tw-text-lg tw-mb-4 tw-mt-5">2. Buttons</h1>
    <h3 class="tw-font-semibold tw-text-md">Types:</h3>
    <div class="tw-flex tw-items-end tw-mt-2">
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Primary'"
          :type="'primary'"
          :mode="'dark'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Secondary'"
          :type="'secondary'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Light gray'"
          :type="'light-gray'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Gray'"
          :type="'gray'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Dark'"
          :type="'dark'"
          :mode="'dark'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Orange'"
          :type="'orange'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
    </div>

    <hr class="tw-my-4 tw-border-dashed tw-border-gray"/>

    <h3 class="tw-font-semibold tw-text-md">Sizes: sm, md, lg, xl</h3>
    <div class="tw-flex tw-items-end">
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Primary'"
          :type="'primary'"
          :mode="'dark'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'md'"
          :text="'Primary'"
          :type="'primary'"
          :mode="'dark'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'lg'"
          :text="'Primary'"
          :type="'primary'"
          :mode="'dark'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'xl'"
          :text="'Primary'"
          :type="'primary'"
          :mode="'dark'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
    </div>

    <hr class="tw-my-4 tw-border-dashed tw-border-gray"/>

    <h3 class="tw-font-semibold tw-text-md">Icons</h3>
    <h4 class="tw-mt-2"># Leading icon</h4>
    <div class="tw-flex tw-items-end">
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'sm'"
          :text="'Leading icon'"
          :type="'gray'"
      >
        <template #leadingIcon>
          <img src="~/assets/images/settings.png" alt="leadingIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'md'"
          :text="'Leading icon'"
          :type="'gray'"
      >
        <template #leadingIcon>
          <img src="~/assets/images/settings.png" alt="leadingIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'lg'"
          :text="'Leading icon'"
          :type="'gray'"
      >
        <template #leadingIcon>
          <img src="~/assets/images/settings.png" alt="leadingIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'xl'"
          :text="'Leading icon'"
          :type="'gray'"
      >
        <template #leadingIcon>
          <img src="~/assets/images/settings.png" alt="leadingIcon" />
        </template>
      </the-button>
    </div>
    <h4 class="tw-mt-2"># Trailing icon</h4>
    <div class="tw-flex tw-items-end">
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'sm'"
          :text="'Trailing icon'"
          :type="'gray'"
      >
        <template #trailingIcon>
          <img src="~/assets/images/settings.png" alt="trailIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'md'"
          :text="'Trailing icon'"
          :type="'gray'"
      >
        <template #trailingIcon>
          <img src="~/assets/images/settings.png" alt="trailIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'lg'"
          :text="'Trailing icon'"
          :type="'gray'"
      >
        <template #trailingIcon>
          <img src="~/assets/images/settings.png" alt="trailIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'xl'"
          :text="'Trailing icon'"
          :type="'gray'"
      >
        <template #trailingIcon>
          <img src="~/assets/images/settings.png" alt="trailIcon" />
        </template>
      </the-button>
    </div>
    <h4 class="tw-mt-2"># Only icon</h4>
    <div class="tw-flex tw-items-end">
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'sm'"
          :type="'secondary'"
      >
        <template #trailingIcon>
          <img src="~/assets/images/settings.png" alt="trailIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'md'"
          :type="'secondary'"
      >
        <template #trailingIcon>
          <img src="~/assets/images/settings.png" alt="trailIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'lg'"
          :type="'secondary'"
      >
        <template #trailingIcon>
          <img src="~/assets/images/settings.png" alt="trailIcon" />
        </template>
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :size="'xl'"
          :type="'secondary'"
      >
        <template #trailingIcon>
          <img src="~/assets/images/settings.png" alt="trailIcon" />
        </template>
      </the-button>
    </div>

    <hr class="tw-my-4 tw-border-dashed tw-border-gray"/>

    <h3 class="tw-font-semibold tw-text-md">Variants</h3>
    <h4 class="tw-mt-2"># Outline</h4>
    <div class="tw-flex tw-items-end tw-mt-2">
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Outline'"
          :type="'primary'"
          :variant="'outline'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Outline'"
          :type="'secondary'"
          :variant="'outline'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Outline'"
          :type="'light-gray'"
          :variant="'outline'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Outline'"
          :type="'gray'"
          :variant="'outline'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Outline'"
          :type="'dark'"
          :variant="'outline'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Outline'"
          :type="'orange'"
          :variant="'outline'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
    </div>
    <h4 class="tw-mt-2"># Ghost</h4>
    <div class="tw-flex tw-items-end">
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Ghost'"
          :type="'primary'"
          :variant="'ghost'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Ghost'"
          :type="'secondary'"
          :variant="'ghost'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Ghost'"
          :type="'light-gray'"
          :variant="'ghost'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Ghost'"
          :type="'gray'"
          :variant="'ghost'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Ghost'"
          :type="'dark'"
          :variant="'ghost'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Ghost'"
          :type="'orange'"
          :variant="'ghost'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
    </div>

    <hr class="tw-my-4 tw-border-dashed tw-border-gray"/>

    <h3 class="tw-font-semibold tw-text-md">Shapes</h3>
    <div class="tw-flex tw-items-end tw-mt-2">
      <the-button
          :text="'Ghost'"
          :type="'gray'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-sm'"
          :text="'Ghost'"
          :type="'gray'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded'"
          :text="'Ghost'"
          :type="'gray'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-lg'"
          :text="'Ghost'"
          :type="'gray'"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-full'"
          :type="'gray'"
      >
        <template #leadingIcon>
          <img src="~/assets/images/settings.png" alt="leadingIcon" />
        </template>
      </the-button>
    </div>

    <hr class="tw-my-4 tw-border-dashed tw-border-gray"/>

    <h3 class="tw-font-semibold tw-text-md">Disable</h3>
    <div class="tw-flex tw-items-end tw-mt-2">
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Primary'"
          :type="'primary'"
          :mode="'dark'"
          :disabled="true"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Secondary'"
          :type="'secondary'"
          :disabled="true"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Light gray'"
          :type="'light-gray'"
          :disabled="true"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Gray'"
          :type="'gray'"
          :disabled="true"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Dark'"
          :type="'dark'"
          :mode="'dark'"
          :disabled="true"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
      <the-button
          :shape="'tw-rounded-[5px]'"
          :text="'Orange'"
          :type="'orange'"
          :disabled="true"
          :manual-custom="{minWidth: '117px'}"
      >
      </the-button>
    </div>

    <h1 class="tw-font-semibold tw-text-lg tw-mb-4 tw-mt-5">3. Datepicker</h1>

    <date-picker @update:range="(newVal) => range= newVal"
                 :time-range="range">
    </date-picker>
    <date-picker :placeholder="'Recent update'"
                 :inputClassName="'tw-mt-2'"
                 :time-range="range1"
                 @update:range="(newVal) => range1= newVal"
    >
    </date-picker>

    <h1 class="tw-font-semibold tw-text-lg tw-mb-4 tw-mt-5">4. Loading</h1>
    <h4 class="tw-mt-2"># Loading Block</h4>
    <div class="tw-flex">
      <div class="tw-w-[200px]">
        <the-loading :min="200"></the-loading>
      </div>
      <div class="tw-w-[200px]">
        <the-loading :min="200" :color="'secondary'"></the-loading>
      </div>
    </div>
    <h4 class="tw-mt-2 tw-mb-2"># Loading Screen</h4>
    <the-button
        :shape="'tw-rounded-[5px]'"
        :text="'Show loading screen'"
        :type="'primary'"
        :mode="'dark'"
        @click="showLoadingScreen"
    >
    </the-button>
  </div>

  <the-loading-screen v-if="isShow"></the-loading-screen>
</template>
<script lang="ts" setup>
import TheMultipleSelect from "~/pages/app/Locaq/components/TheMultipleSelect.vue";
import TheButton from "~/pages/app/Locaq/components/TheButton.vue";
import TheLoading from "~/pages/app/Locaq/components/TheLoading.vue";
import TheLoadingScreen from "~/pages/app/Locaq/components/TheLoadingScreen.vue";
import DatePicker from "~/pages/app/Locaq/components/DatePicker.vue";

interface Option {
  text?: string,
  code?: number,
  isDisabled?: boolean
}

const tags = ref<Option[]>([
  {
    text: 'License',
    code: 1,
    isDisabled: false
  },
  {
    text: 'Github Stars',
    code: 2,
    isDisabled: false
  },
  {
    text: 'Npm Monthly Downloads',
    code: 3,
    isDisabled: true
  },
  {
    text: 'Full Test Coverage',
    code: 4,
    isDisabled: false
  },
  {
    text: 'NO Dependencies',
    code: 5,
    isDisabled: true
  },
  {
    text: 'Fully configurable',
    code: 6,
    isDisabled: false
  },
  {
    text: 'Ajax support',
    code: 7,
    isDisabled: false
  }
])
const tags2 = ref<Option[]>([
  {
    text: 'License',
    code: 1,
    isDisabled: false
  },
  {
    text: 'Github Stars',
    code: 2,
    isDisabled: false
  },
  {
    text: 'Npm Monthly Downloads',
    code: 3,
    isDisabled: true
  },
  {
    text: 'Full Test Coverage',
    code: 4,
    isDisabled: false
  },
  {
    text: 'NO Dependencies',
    code: 5,
    isDisabled: true
  },
  {
    text: 'Fully configurable',
    code: 6,
    isDisabled: false
  },
  {
    text: 'Ajax support',
    code: 7,
    isDisabled: false
  }
])
const selectedOptions = ref<Option[]>([])
const selectedOptions2 = ref<Option[]>([])
const isShow = ref<boolean>(false)
const range = ref<string[]>([])
const range1 = ref<string[]>([])
const defaultSelectedOptions = ref<Option[]>([
  {
    text: 'License',
    code: 1,
    isDisabled: false
  },
  {
    text: 'Ajax support',
    code: 7,
    isDisabled: false
  }
])
const showLoadingScreen = () => {
  isShow.value = true

  setTimeout(() => {
    isShow.value = false
  }, 5000)
}
</script>
<style lang="scss">
button + button {
  margin-left: 20px;
}
</style>