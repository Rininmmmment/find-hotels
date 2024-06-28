<script setup>
  import { ref } from 'vue';
  // ユーザーから入力を受ける変数
  const station = ref('渋谷');
  const checkinDate = ref('2024-07-19');
  const checkoutDate = ref('2024-07-20');
</script>

<template>
  <div class="md:w-96 w-60 mx-auto mb-10">
    <label class="input input-bordered flex items-center gap-10 m-2 bg-white">
      駅
      <input v-model="station" type="text" class="grow w-full" placeholder="○○駅" />
    </label>
  
    <label class="input input-bordered flex items-center gap-10 m-2 bg-white">
      in
      <input v-model="checkinDate" type="date" class="grow w-full" placeholder="○○駅" />
    </label>
    
    <label class="input input-bordered flex items-center gap-10 m-2 bg-white">
      out
      <input v-model="checkoutDate" type="date" class="grow w-full" placeholder="○○駅" />
    </label>
  
    <div class="flex justify-center">
      <button @click="$emit('sendInputParams', [station, checkinDate, checkoutDate])" class="btn btn-secondary m-5 md:w-40 w-32">検索</button>
    </div>
  </div>
</template>

<style scoped>
</style>