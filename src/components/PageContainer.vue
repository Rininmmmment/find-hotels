<script setup>
  import { ref } from 'vue';
  
  // ユーザーから入力を受ける変数
  const station = ref('渋谷');
  const transferTime = ref(60);
  const checkinDate = ref('2024-07-19');
  const checkoutDate = ref('2024-07-20');
  
  // 駅の緯度経度を入れる変数
  const latitude = ref(0);
  const longitude = ref(0);
  
  // ホテル情報を表示するための変数
  const allHotelData = ref([]);
  
  // ホテル詳細情報を表示するための変数
  const searchWords = ['部屋', '朝食', '施設'];
  const selectedHotelRoomImgUrl = ref([]);
  const selectedHotelInfo = ref();
  
  // エラー表示用の変数
  const getLatAndLngError = ref('');
  const fetchRakutenTravelError = ref('');
  const getDetailsError = ref('');
  
  // 駅名から緯度経度を求めるメソッド
  // 例：渋谷駅を調べたいなら"渋谷"を入力
  const getLatAndLng = async () => {
    // リクエストパラメータの作成
    const paramsObject = {
      method: 'getStations',
      name: station.value
    };
    const params = new URLSearchParams(paramsObject).toString();
    const url = `https://express.heartrails.com/api/json?${params}`;
    await fetch(url)
      .then((response) => {
        const status = response.status;
        return response.json()
          .then((data) => {
            // データが取得できなかった場合
            if (status !== 200) {
              getLatAndLngError.value = '駅の緯度・経度を取得できませんでした';
              throw new Error('データの取得に失敗しました。');
            }

            // データが取得できた場合
            latitude.value = data.response.station[0].y;
            longitude.value = data.response.station[0].x;
            getLatAndLngError.value = '';

          }).catch((error) => {
            getLatAndLngError.value = '駅の緯度・経度を取得できませんでした。\n正しい駅名を入力してください。';
            // console.error(`エラーが発生しました： ${error.message}`);
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
    await getLatAndLng();
    
    // リセット
    allHotelData.value = [];

    // ホテル検索用リクエストパラメータの作成
    const paramsObject = {
      applicationId: import.meta.env.VITE_RAKUTEN_APP_ID,
      format: 'json',
      checkinDate: checkinDate.value,
      checkoutDate: checkoutDate.value,
      datumType: '1',  // 緯度経度を世界測地系にする
      latitude: latitude.value,
      longitude: longitude.value,
      searchRadius: '2',
      hits: '30',
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
              fetchRakutenTravelError.value = 'ホテル情報の取得に失敗しました';
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
              fetchRakutenTravelError.value = '';
            });
          }).catch((error) => {
            fetchRakutenTravelError.value = 'ホテル情報の取得に失敗しました。\n入力値が正しいことを確認してください。';
            // console.error(`エラーが発生しました： ${error.message}`);
          });
      })
  }
  
  // ホテルの詳細を調べて返すメソッド
  const getDetails = async (hotelIndex) => {
    // 選択されたホテルの情報を詰める
    selectedHotelInfo.value = allHotelData.value[hotelIndex];
    // console.log(selectedHotelInfo);
  
    // 中身をリセットする
    selectedHotelRoomImgUrl.value = [];
    
    searchWords.forEach(async (word) => {
      // ホテルの写真を検索
      const detailParamsObject = {
        key: import.meta.env.VITE_GOOGLE_KEY,
        q: allHotelData.value[hotelIndex]['hotelInfo']['hotelName'] + ' ' + word,
        cx: import.meta.env.VITE_GOOGLE_CX,
        searchType: 'image',
        num: '9'
      };
      const detailParams = new URLSearchParams(detailParamsObject).toString();
      const detailUrl = `https://customsearch.googleapis.com/customsearch/v1?${detailParams}`;
      await fetch(detailUrl)
        .then((response) => {
          const status = response.status;
          return response.json()
            .then((data) => {
              // データが取得できなかった場合
              if (status !== 200) {
              getDetailsError.value = 'Googleから画像を取得できませんでした。\n時間をおいてやり直してください。';
                throw new Error('データの取得に失敗しました。');
              }
  
              // データが取得できた場合
              const seachResults = data.items;
              seachResults.forEach((searchResult) => {
                selectedHotelRoomImgUrl.value.push(searchResult.link);
              })

              getDetailsError.value = '';
            }).catch((error) => {
              getDetailsError.value = 'Googleから画像を取得できませんでした。\n時間をおいてやり直してください。';
              // console.error(`エラーが発生しました： ${error.message}`);
            });
        })
        
      if (window.innerWidth < 1024) {
        my_modal_1.showModal();
      }
    })
  }
  
</script>

<template>
  <!--ナビバー-->
  <div class="navbar bg-primary shadow">
    <a class="btn btn-ghost text-xl">Find Hotels</a>
  </div>
  <!--ここまでナビバー-->
    
  <div class="lg:flex">
    <!--詳細のセクション-->
<dialog id="my_modal_1" class="modal w-11/12">
  <div class="modal-box">
    <!--中身-->
    <div class="mx-auto lg:p-10" v-if="selectedHotelInfo">
      <!--ホテル情報コンテナ-->
      <div class="mb-20">
        <!--画像のコンテナ-->
        <div class="divider divider-primary">Hotel Images by Google Search</div>
        <div v-if="getDetailsError !== ''" role="alert" class="alert alert-error">
          <div role="alert" class="alert alert-error mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ getDetailsError }}</span>
          </div>
        </div>
        <div class="my-5 flex flex-wrap justify-center mx-auto mb-10 w-full">
          <a v-for="url in selectedHotelRoomImgUrl" v-bind:href="url" target="_blank" class="inline-block">
            <img v-bind:src="url" alt="HotelImage" class="object-fill object-center" style="width: 130px; height: 130px;">
          </a>
        </div>
        
        <!--ホテル情報のコンテナ-->
        <div class="divider divider-primary">Hotel Information</div>
        <h3 class="text-2xl mb-2">{{ selectedHotelInfo?.hotelInfo?.hotelName }}</h3>
        <p>{{ selectedHotelInfo?.hotelInfo?.hotelSpecial }}</p>
        <div class="flex justify-center gap-5">
          <img :src="selectedHotelInfo?.hotelInfo?.hotelImageUrl" class="my-5" style="width: 135px;">
          <img :src="selectedHotelInfo?.hotelInfo?.roomImageUrl" class="my-5" style="width: 135px;">
        </div>
        <div class="flex justify-center gap-5 m-7">
          <a :href="selectedHotelInfo?.hotelInfo?.hotelInformationUrl" target="_blank" class="btn btn-outline btn-primary">ホテル情報ページ</a>
        </div>
    
        <div class="divider divider-primary mt-10">Access</div>
        <p>{{ selectedHotelInfo?.hotelInfo?.access }}</p>
        <img :src="selectedHotelInfo?.hotelInfo?.hotelMapImageUrl" class="my-5 inline-box mx-auto" style="width: 380px;">
    
        <div class="divider divider-primary mt-10">User Review</div>
        <div class="chat chat-start">
          <div class="chat-bubble chat-bubble-primary" v-html="selectedHotelInfo?.hotelInfo?.userReview || 'レビューが見つかりませんでした。リンクから確認してください。'"></div>
        </div>
        <div class="flex justify-center gap-5 my-7">
          <a :href="selectedHotelInfo?.hotelInfo?.reviewUrl" target="_blank" class="btn btn-outline btn-primary">レビューページ</a>
        </div>
      </div>
    </div>

    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
    
    
    
    <!--PCサイズのとき-->
    <div class="lg:w-1/3 lg:block hidden w-2/3 mx-auto p-10" v-if="selectedHotelInfo">
      <!--ホテル情報コンテナ-->
      <div class="mb-20">
        <!--画像のコンテナ-->
        <div class="divider divider-primary">Hotel Images by Google Search</div>
        <div v-if="getDetailsError !== ''" role="alert" class="alert alert-error">
          <div role="alert" class="alert alert-error mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ getDetailsError }}</span>
          </div>
        </div>
        <div class="my-5 flex flex-wrap justify-center mx-auto mb-10 w-full">
          <a v-for="url in selectedHotelRoomImgUrl" v-bind:href="url" target="_blank" class="inline-block">
            <img v-bind:src="url" alt="HotelImage" class="object-fill object-center" style="width: 130px; height: 130px;">
          </a>
        </div>
        
        <!--ホテル情報のコンテナ-->
        <div class="divider divider-primary">Hotel Information</div>
        <h3 class="text-2xl mb-2">{{ selectedHotelInfo?.hotelInfo?.hotelName }}</h3>
        <p>{{ selectedHotelInfo?.hotelInfo?.hotelSpecial }}</p>
        <div class="flex justify-center gap-5">
          <img :src="selectedHotelInfo?.hotelInfo?.hotelImageUrl" class="my-5" style="width: 135px;">
          <img :src="selectedHotelInfo?.hotelInfo?.roomImageUrl" class="my-5" style="width: 135px;">
        </div>
        <div class="flex justify-center gap-5 m-7">
          <a :href="selectedHotelInfo?.hotelInfo?.hotelInformationUrl" target="_blank" class="btn btn-outline btn-primary">ホテル情報ページ</a>
        </div>
    
        <div class="divider divider-primary mt-10">Access</div>
        <p>{{ selectedHotelInfo?.hotelInfo?.access }}</p>
        <img :src="selectedHotelInfo?.hotelInfo?.hotelMapImageUrl" class="my-5 inline-box mx-auto" style="width: 380px;">
    
        <div class="divider divider-primary mt-10">User Review</div>
        <div class="chat chat-start">
          <div class="chat-bubble chat-bubble-primary" v-html="selectedHotelInfo?.hotelInfo?.userReview || 'レビューが見つかりませんでした。リンクから確認してください。'"></div>
        </div>
        <div class="flex justify-center gap-5 my-7">
          <a :href="selectedHotelInfo?.hotelInfo?.reviewUrl" target="_blank" class="btn btn-outline btn-primary">レビューページ</a>
        </div>
      </div>
    </div>
    <!--ここまで詳細のセクション-->
    
    <!--右側のセクション-->
    <div class="py-10 px-0 md:w-2/3 w-11/12 mx-auto">
      <!--エラーと入力フォームのコンテナ-->
      <div class="">  
        <!--エラー-->
        <div v-if="getLatAndLngError != ''" role="alert" class="alert alert-error mb-5">
          <div role="alert" class="alert alert-error mx-auto">
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
              {{getLatAndLngError}}
            </span>
          </div>
        </div>
        <div v-if="fetchRakutenTravelError != ''" role="alert" class="alert alert-error mb-5">
          <div role="alert" class="alert alert-error mx-auto">
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
              {{fetchRakutenTravelError}}
            </span>
          </div>
        </div>
        
        <!-- 入力フォーム -->
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
            <button @click="fetchRakutenTravel" class="btn btn-secondary m-5 md:w-40 w-32">検索</button>
          </div>
        </div>
      </div>
      <!--ここまでエラーと入力フォームのコンテナ-->
      
      <!-- 出力のコンテナ -->
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
      <!-- ここまで出力のコンテナ -->
      
    </div>
    <!--ここまで左側のセクション-->
  </div>
</template>

<style scoped>
</style>