<script setup>
  defineProps({
    allHotelData: {
      type: Array,
      required: true,
      default: () => []//空の配列を生成する関数を指定する
    }
  })
</script>

<template>
  <div class="w-full">
    <div class="flex flex-row flex-wrap justify-center mx-auto">
      <div v-for="(hotelData, hotelDataNum) in allHotelData" :key="hotelDataNum" class="card relative bg-base-90 lg:w-5/12 w-full shadow-xl mx-1 my-5">
        <figure class="h-30 w-30">
          <img
            :src="hotelData['hotelInfo']['hotelImageUrl']"
            alt="HotelImage"
            class="object-contain h-full w-full object-center"
            style="width: 784px; height: 270px; object-fit: cover;"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ allHotelData[hotelDataNum]["hotelInfo"]["hotelName"] }}</h2>
          <span class="">レビュー平均 {{ allHotelData[hotelDataNum]["hotelInfo"]["reviewAverage"] }} ( {{ allHotelData[hotelDataNum]["hotelInfo"]["reviewCount"] }} 件中 )</span>
          <div class="card-actions justify-end mt-5">
            <div v-for="i in [0]" class="w-full">
              <a :href="allHotelData[hotelDataNum]['roomInfo'][i]['reserveUrl']" class="inline-block text-lg mb-3" target="_blank">{{ allHotelData[hotelDataNum]["roomInfo"][i]["planName"] }}</a>
              <div class="text-sm text-gray-400">{{ allHotelData[hotelDataNum]["roomInfo"][i]["roomName"] }}</div>
              <p class="mt-3 text-right">大人1名1泊 <span class="text-4xl font-extrabold ml-5">&yen;{{ allHotelData[hotelDataNum]['dailyCharge'][i]['total'] }}</span></p>
            </div>
            <a :href="allHotelData[hotelDataNum]['hotelInfo']['planListUrl']" target="_blank" class="btn btn-outline btn-primary w-full my-4">プラン一覧ページ</a>
            <button @click="getDetails(hotelDataNum)" class="btn btn-primary inline-box mx-auto w-full">ホテルを詳しく調べる</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>