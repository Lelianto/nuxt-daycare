<template>
  <div class="w-full flex justify-center">
    <div class="scroll-hide w-full max-w-sm bg-gray-50 max-h-screen min-h-screen overflow-y-scroll border-4 border-light-blue-500 border-opacity-50">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
	name: 'Default'
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scroll-hide::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scroll-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
