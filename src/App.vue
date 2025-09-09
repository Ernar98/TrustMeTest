<template>
	<main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
		<h1 class="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
			Квартиры в Астане
		</h1>
		<section class="rounded-2xl bg-white p-4 sm:p-6 shadow mb-6">
			<Filters v-model="filters" @apply="applyFilters" />
		</section>

		<section class="flex items-center justify-between mb-3">
			<p class="text-sm text-gray-600">
				Найдено:
				<span class="font-semibold text-gray-800">{{ filtered.length }}</span>
			</p>
			<div class="flex gap-2 items-center">
				<label for="sort" class="text-sm text-gray-600">Сортировка:</label>
				<select id="sort" v-model="sortBy" class="input">
					<option value="relevance">По релевантности</option>
					<option value="areaDesc">Площадь ↓</option>
					<option value="areaAsc">Площадь ↑</option>
					<option value="roomsDesc">Комнат ↓</option>
					<option value="roomsAsc">Комнат ↑</option>
				</select>
			</div>
		</section>

		<section v-if="loading" class="py-20 text-center text-gray-600">
			Загрузка…
		</section>
		<section v-else>
			<div v-if="filtered.length === 0" class="py-16 text-center text-gray-600">
				По вашему запросу ничего не найдено.
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				<ListingCard v-for="l in paged" :key="l.id" :listing="l" />
			</div>

			<div v-if="pages > 1" class="flex justify-center items-center gap-2 mt-8">
				<button
					class="btn"
					:disabled="page === 1"
					@click="page--"
					aria-label="Предыдущая страница"
				>
					←
				</button>
				<span class="text-sm">Стр. {{ page }} из {{ pages }}</span>
				<button
					class="btn"
					:disabled="page === pages"
					@click="page++"
					aria-label="Следующая страница"
				>
					→
				</button>
			</div>
		</section>
	</main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Filters from './components/Filters.vue';
import ListingCard from './components/ListingCard.vue';
import { parseQuery, pushQuery } from './utils/queryState';

const loading = ref(true);
const listings = ref([]);

const filters = ref(parseQuery());
const sortBy = ref('relevance');
const page = ref(1);
const perPage = 9;

onMounted(async () => {
	try {
		const res = await fetch('/data/listings.json', {
			headers: { Accept: 'application/json' }
		});
		if (!res.ok) throw new Error('Failed to load data');
		const data = await res.json();
		// Basic schema validation
		listings.value = Array.isArray(data) ? data.filter(isValidListing) : [];
	} catch (e) {
		console.error(e);
		listings.value = [];
	} finally {
		loading.value = false;
	}
});

// sync query string whenever filters change
watch(
	filters,
	(v) => {
		pushQuery(v);
		page.value = 1;
	},
	{ deep: true }
);

function normalize(s) {
	return (s || '').toString().trim().toLowerCase();
}

function isValidListing(obj) {
	return (
		obj &&
		Number.isFinite(obj.area) &&
		Number.isFinite(obj.rooms) &&
		typeof obj.address === 'string' &&
		typeof obj.image === 'string'
	);
}

const filtered = computed(() => {
	const f = filters.value;
	const q = normalize(f.q);
	return listings.value
		.filter((l) => {
			if (f.areaMin !== '' && l.area < Number(f.areaMin)) return false;
			if (f.areaMax !== '' && l.area > Number(f.areaMax)) return false;
			if (f.roomsMin !== '' && l.rooms < Number(f.roomsMin)) return false;
			if (f.roomsMax !== '' && l.rooms > Number(f.roomsMax)) return false;
			if (q && !normalize(l.address).includes(q)) return false;
			return true;
		})
		.sort((a, b) => {
			switch (sortBy.value) {
				case 'areaDesc':
					return b.area - a.area;
				case 'areaAsc':
					return a.area - b.area;
				case 'roomsDesc':
					return b.rooms - a.rooms;
				case 'roomsAsc':
					return a.rooms - b.rooms;
				default:
					return 0;
			}
		});
});

const pages = computed(() =>
	Math.max(1, Math.ceil(filtered.value.length / perPage))
);
const paged = computed(() => {
	const start = (page.value - 1) * perPage;
	return filtered.value.slice(start, start + perPage);
});

function applyFilters() {
	console.log('applyFilters');
	//для серверных запросов
}
</script>

<style scoped>
.input {
	@apply rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-indigo-500;
}
.btn {
	@apply rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
