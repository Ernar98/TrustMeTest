<template>
  <article class="rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white h-full flex flex-col">
    <img
      :src="listing.image"
      :alt="`Фото квартиры по адресу ${listing.address}`"
      class="h-44 w-full object-cover"
      loading="lazy"
      referrerpolicy="no-referrer"
    />
    <div class="p-4 flex flex-col gap-2 flex-1">
      <header class="flex items-start justify-between gap-3">
        <h3 class="font-semibold text-lg leading-tight">{{ listing.rooms }}‑комн · {{ listing.area }} м²</h3>
      </header>
      <p class="text-sm text-gray-600 line-clamp-2" :title="listing.address">{{ listing.address }}</p>
      <div class="mt-auto pt-2">
        <a
          class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
          :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть в картах
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  listing: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
