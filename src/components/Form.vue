<script setup>
  import { ref } from 'vue';
  
  // ユーザーから入力を受ける変数
  const station = ref('');
  const transferTime = ref(60);
  const checkinDate = ref('');
  
  // ホテル情報を表示するための変数
  const allHotelData = ref([]);
  
  // Ramdaを使ってAPIレスポンスから各ホテル情報を取得するメソッド3つ
  const getHotelInfo = R.pipe(
    R.map(R.path([0, 'hotelBasicInfo']))
  );
  
  let contentNum = 1;
  const getRoomInfo = R.pipe(
    R.map(R.path([contentNum, 'roomInfo', 0, 'roomBasicInfo']))
  );

  const getDailyCharge = R.pipe(
    R.map(R.path([contentNum, 'roomInfo', 1, 'dailyCharge']))
  );
  // ここまでRamdaを使って各ホテル情報を取得するメソッド
  
  
  // 入力値からAPIをたたいてホテル情報を返すメソッド
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
      hits: '5'
    };
    const params = new URLSearchParams(paramsObject).toString();
    const url = `https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426?${params}`;

    // APIをたたく
    fetch(url)
      .then((response) => {
        const status = response.status;
        return response.json()
          .then((data) => {
            // データが取得できなかった場合
            if (status !== 200) {
              throw new Error('データの取得に失敗しました。');
            }

            // データが取得できた場合
            const hotels = data.hotels;
            hotels.forEach((hotel) => {
              // ホテルの基本情報
              const hotelInfo = getHotelInfo(hotel).hotel;
              
              // 空き部屋情報（詳細と金額）
              let roomInfo = [];
              let dailyCharge = [];
              contentNum = 1  // 1つ目の部屋情報
              roomInfo.push(getRoomInfo(hotel).hotel);
              dailyCharge.push(getDailyCharge(hotel).hotel);
              
              contentNum = 2;  // 2つ目の部屋情報
              roomInfo.push(getRoomInfo(hotel).hotel);
              dailyCharge.push(getDailyCharge(hotel).hotel);
              
              // 表示用の配列に追加する
              allHotelData.value.push({hotelInfo: hotelInfo, roomInfo: roomInfo, dailyCharge: dailyCharge});
            });
            console.log(allHotelData);
          }).catch((error) => {
            console.error(`エラーが発生しました： ${error.message}`);
          });
      })
  }
  
</script>

<template>
  <div class="flex justify-center p-5 flex-row">
    <!-- 入力フォーム -->
    <div class="w-1/2">
      <label class="input input-bordered flex items-center gap-10 m-5 bg-white">
        最寄り駅
        <input v-model="station" type="text" class="grow" placeholder="○○駅" />
      </label>
    
      <div class="m-5">
        <p class="pb-2">移動時間</p>
        <input v-model="transferTime" type="range" min="0" max="120" value="60" class="range" step="30" />
        <div class="w-full flex justify-between text-xs px-2">
          <span>0分</span>
          <span>30分</span>
          <span>60分</span>
          <span>90分</span>
          <span>120分</span>
        </div>
      </div>
      
      <label class="input input-bordered flex items-center gap-10 m-5 bg-white">
        チェックイン日
        <input v-model="checkinDate" type="date" class="grow" placeholder="○○駅" />
      </label>
      
      <label class="input input-bordered flex items-center gap-10 m-5 bg-white">
        チェックアウト日
        <input v-model="checkoutDate" type="date" class="grow" placeholder="○○駅" />
      </label>
      
      <div class="flex justify-center">
        <button @click="fetchRakutenTravel" class="btn btn-primary m-5">検索</button>
      </div>
    </div>
    
    <!-- 出力 -->
    
    <div>
      <div class="w-1/2">
        <div v-for="hotelData in allHotelData">
          <h1 class="text-4xl">{{hotelData["hotelInfo"]["hotelName"]}}</h1>
          <!--レビュー平均と件数-->
          <p>レビュー平均{{hotelData["hotelInfo"]["reviewAverage"]}} ( {{hotelData["hotelInfo"]["reviewCount"]}} 件中 )</p>
          <!--予約URL-->
          <!--温泉とか朝食とかアメニティとかの推しポイントが出ればなおよい-->
          <!--部屋やプランの情報-->
          <!--価格-->
          <!--プラン名-->
          <!--部屋の名前-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>