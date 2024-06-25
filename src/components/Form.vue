<script setup>
  import { ref } from 'vue';
  
  // ユーザーから入力を受ける変数
  const station = ref('池袋');
  const transferTime = ref(60);
  const checkinDate = ref('2024-07-19');
  const checkoutDate = ref('2024-07-20');
  
  // 駅の緯度経度を入れる変数
  const latitude = ref(0);
  const longitude = ref(0);
  
  // ホテル情報を表示するための変数
  const allHotelData = ref([]);
  
  // エラー表示用の変数
  const getLatAndLngError = ref('');
  const fetchRakutenTravelError = ref('');
  
  // 駅名から緯度経度を求めるメソッド
  // 例：渋谷駅を調べたいなら"渋谷"を入力
  const getLatAndLng = () => {
    // リクエストパラメータの作成
    const paramsObject = {
      method: 'getStations',
      name: '池袋'
    };
    const params = new URLSearchParams(paramsObject).toString();
    const url = `https://express.heartrails.com/api/json?${params}`;
    fetch(url)
      .then((response) => {
        const status = response.status;
        return response.json()
          .then((data) => {
            // データが取得できなかった場合
            if (status !== 200) {
              getLatAndLngError = '駅の緯度・経度を取得できませんでした';
              throw new Error('データの取得に失敗しました。');
            }

            // データが取得できた場合
            latitude.value = data.response.station[0].y;
            longitude.value = data.response.station[0].x;
          }).catch((error) => {
            getLatAndLngError = '駅の緯度・経度を取得できませんでした';
            console.error(`エラーが発生しました： ${error.message}`);
          });
      })
  }
  
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
  const fetchRakutenTravel = async () => {
    // 駅の緯度経度を探す
    const staParamsObject = {
      method: 'getStations',
      name: station.value
    };
    const staParams = new URLSearchParams(staParamsObject).toString();
    const staUrl = `https://express.heartrails.com/api/json?${staParams}`;
    await fetch(staUrl)
      .then((response) => {
        const status = response.status;
        return response.json()
          .then((data) => {
            // データが取得できなかった場合
            if (status !== 200) {
              getLatAndLngError = '駅の緯度・経度を取得できませんでした';
              throw new Error('データの取得に失敗しました。');
            }

            // データが取得できた場合
            latitude.value = data.response.station[0].y;
            longitude.value = data.response.station[0].x;
          }).catch((error) => {
            getLatAndLngError = '駅の緯度・経度を取得できませんでした';
            console.error(`エラーが発生しました： ${error.message}`);
          });
      })
        
    // リクエストパラメータの作成
    const paramsObject = {
      applicationId: import.meta.env.VITE_RAKUTEN_APP_ID,
      format: 'json',
      checkinDate: checkinDate.value,
      checkoutDate: checkoutDate.value,
      datumType: '1',  // 緯度経度を世界測地系にする
      latitude: latitude.value,
      longitude: longitude.value,
      searchRadius: '2',
      hits: '10',
      adultNum: '1',
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
              fetchRakutenTravelError = 'ホテル情報の取得に失敗しました';
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
            fetchRakutenTravelError = 'ホテル情報の取得に失敗しました';
            console.error(`エラーが発生しました： ${error.message}`);
          });
      })
  }
  
</script>

<template>
  <div class="p-10">
    <!--エラー-->
    <!--<div v-if="getLatAndLngError != '' | fetchRakutenTravelError != ''" role="alert" class="alert alert-error">-->
    <div role="alert" class="alert alert-error w-1/2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {{getLatAndLngError}}<br>
        {{fetchRakutenTravelError}}
      </span>
    </div>
    
    
    <!-- 入力フォーム -->
    <div class="w-1/3">
      <label class="input input-bordered flex items-center gap-10 m-5 bg-white">
        最寄り駅
        <input v-model="station" type="text" class="grow" placeholder="○○駅" />
      </label>
    
      <div class="m-5">
        <p class="pb-2">最寄駅からの距離</p>
        <input v-model="transferTime" type="range" min="0" max="120" value="60" class="range" step="30" />
        <div class="w-full flex justify-between text-xs px-2">
          <span>1km以内</span>
          <span></span>
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
      <div class="">
        
        <div  v-for="hotelData in allHotelData" class="card bg-base-100 w-96 shadow-xl">
          <figure>
            <img
              :src="hotelData['hotelInfo']['hotelImageUrl']"
              alt="Shoes" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{hotelData["hotelInfo"]["hotelName"]}}</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div class="card-actions justify-end">
              <div v-for="i in [0, 1]">
                <a :href="hotelData['roomInfo'][i]['reserveUrl']" class="btn btn-primary">\ {{hotelData['dailyCharge'][i]['total']}}</a>
              </div>
            </div>
          </div>
        </div>
        
        <div v-for="hotelData in allHotelData">
          <a :href="hotelData['hotelInfo']['hotelInformationUrl']" class="text-4xl">{{hotelData["hotelInfo"]["hotelName"]}}</a>
          <!--レビュー平均と件数-->
          <p>レビュー平均{{hotelData["hotelInfo"]["reviewAverage"]}} ( {{hotelData["hotelInfo"]["reviewCount"]}} 件中 )</p>
          <!--予約URL-->
          <!--温泉とか朝食とかアメニティとかの推しポイントが出ればなおよい-->
          
          <!--部屋やプランの情報-->
          <div v-for="i in [0, 1]">
            <a :href="hotelData['roomInfo'][i]['reserveUrl']" class="">{{hotelData["roomInfo"][i]["planName"]}} / {{hotelData["roomInfo"][i]["roomName"]}}</a>
            <p>{{hotelData['dailyCharge'][i]['total']}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>