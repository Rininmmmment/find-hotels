<script setup>
  import { ref } from 'vue';
  
  const station = ref('');
  const transferTime = ref(25);
  const checkinDate = ref('');
  
  // 入力値からホテル情報を返す
  const fetchRakutenTravel = () => {
    // リクエストパラメータの作成
    const paramsObject = {
      applicationId: import.meta.env.VITE_RAKUTEN_APP_ID,
      format: 'json',
      checkinDate: '2024-7-19',
      checkoutDate: '2024-7-20',  // 仮の値
      datumType: '1',  // 緯度経度を世界測地系にする
      latitude: '35.658871',
      longitude: '139.701238',
      searchRadius: '1',
    };
    const params = new URLSearchParams(paramsObject).toString();
    const url = `https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426?${params}`;

    // APIをたたく
    fetch(url)
      .then((response) => {
        const status = response.status;
        return response.json()
          .then((data) => {
            console.log(data);
        
            // データが取得できなかった場合
            if (status !== 200) {
              throw new Error('データの取得に失敗しました。');
            }
          }).catch((error) => {
            console.error(`エラーが発生しました： ${error.message}`);
          });
      })
  }
  
</script>

<template>
  <div class="flex justify-center p-5 ">
    <div class="w-1/2">
      <label class="input input-bordered flex items-center gap-10 m-5">
        最寄り駅
        <input v-model="station" type="text" class="grow" placeholder="○○駅" />
      </label>
    
      <div class="m-5">
        <input v-model="transferTime" type="range" min="0" max="120" value="60" class="range" step="30" />
        <div class="w-full flex justify-between text-xs px-2">
          <span>0分</span>
          <span>30分</span>
          <span>60分</span>
          <span>90分</span>
          <span>120分</span>
        </div>
      </div>
      
      <label class="input input-bordered flex items-center gap-10 m-5">
        チェックイン日
        <input v-model="checkinDate" type="date" class="grow" placeholder="○○駅" />
      </label>
      
      <label class="input input-bordered flex items-center gap-10 m-5">
        チェックアウト日
        <input v-model="checkoutDate" type="date" class="grow" placeholder="○○駅" />
      </label>
      
      <div class="flex justify-center">
        <button @click="fetchRakutenTravel" class="btn btn-primary m-5">検索</button>
      </div>
    </div>
  </div>
  {{checkinDate}}
</template>

<style scoped>
</style>