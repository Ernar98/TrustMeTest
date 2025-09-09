<template>
  <form @submit.prevent class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
    <!-- Area Min -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium" for="areaMin">Площадь, от (м²)</label>
      <input
        id="areaMin"
        type="number"
        inputmode="decimal"
        min="0"
        step="0.1"
        class="input"
        v-model.number="local.areaMin"
        @input="emitChangeDebounced()"
      />
    </div>

    <!-- Area Max -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium" for="areaMax">Площадь, до (м²)</label>
      <input
        id="areaMax"
        type="number"
        inputmode="decimal"
        min="0"
        step="0.1"
        class="input"
        v-model.number="local.areaMax"
        @input="emitChangeDebounced()"
      />
    </div>

    <!-- Rooms Min -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium" for="roomsMin">Комнат, от</label>
      <input
        id="roomsMin"
        type="number"
        inputmode="numeric"
        min="0"
        step="1"
        class="input"
        v-model.number="local.roomsMin"
        @input="emitChangeDebounced()"
      />
    </div>

    <!-- Rooms Max -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium" for="roomsMax">Комнат, до</label>
      <input
        id="roomsMax"
        type="number"
        inputmode="numeric"
        min="0"
        step="1"
        class="input"
        v-model.number="local.roomsMax"
        @input="emitChangeDebounced()"
      />
    </div>

    <!-- Address -->
    <div class="sm:col-span-2 lg:col-span-2 flex flex-col gap-1">
      <label class="text-sm font-medium" for="q">Адрес</label>
      <input
        id="q"
        type="search"
        autocomplete="street-address"
        placeholder="Например: Есильский район"
        class="input"
        v-model.trim="local.q"
        @input="emitChangeDebounced()"
      />
    </div>

    <!-- Buttons -->
    <div class="sm:col-span-2 lg:col-span-6 flex flex-wrap gap-3">
      <button type="button" class="btn btn-primary" @click="applyNow">
        Применить
      </button>
      <button type="button" class="btn" @click="resetFilters">
        Сбросить
      </button>
      <span class="text-sm text-gray-600" v-if="validationMessage">{{ validationMessage }}</span>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import { debounce } from '../debounce'

const props = defineProps({
  modelValue: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue', 'apply'])

const local = reactive({ ...props.modelValue })

watch(() => props.modelValue, (v) => Object.assign(local, v))

const validationMessage = computed(() => {
  if (local.areaMin !== '' && local.areaMax !== '' && Number(local.areaMin) > Number(local.areaMax)) {
    return 'Площадь: «от» не может быть больше «до»'
  }
  if (local.roomsMin !== '' && local.roomsMax !== '' && Number(local.roomsMin) > Number(local.roomsMax)) {
    return 'Комнаты: «от» не может быть больше «до»'
  }
  return ''
})

function emitChange () {
  emit('update:modelValue', { ...local })
}

const emitChangeDebounced = debounce(emitChange, 300)

function applyNow () {
  emitChange()
  emit('apply')
}

function resetFilters () {
  local.areaMin = ''
  local.areaMax = ''
  local.roomsMin = ''
  local.roomsMax = ''
  local.q = ''
  applyNow()
}
</script>

<style scoped>
.input {
  @apply w-full rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500;
}
.btn {
  @apply inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700;
}
</style>
