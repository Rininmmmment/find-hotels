<script setup>
  import { ref } from 'vue';
  import NaviBar from './NaviBar.vue';
  import Form from './Form.vue';
  import HotelsList from './HotelsList.vue';
  import Details from './Details.vue';
  import Error from './Error.vue';
  
  // ユーザーから入力を受ける変数
  const station = ref('');
  const checkinDate = ref('');
  const checkoutDate = ref('');
  
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
  <NaviBar />

  <!--メインエリア-->
  <div class="lg:flex">
    <!--詳細エリア エラーがちゃんと表示されるかテストしてません-->
    <Details searchWords="searchWords" :selectedHotelRoomImgUrl="selectedHotelRoomImgUrl" :selectedHotelInfo="selectedHotelInfo" :getDetailsError="getDetailsError" />
    
    <!--右側エリア-->
    <div class="py-10 px-0 md:w-2/3 w-11/12 mx-auto">
      <!--エラーと入力フォームのコンテナ-->
      <div class="">  
        <!--エラー-->
        <Error :getLatAndLngError="getLatAndLngError" :fetchRakutenTravelError="fetchRakutenTravelError" />
        
        <!--入力フォーム-->
        <Form @sendInputParams="(params) => {
          station = params[0];
          checkinDate = params[1];
          checkoutDate = params[2];
          fetchRakutenTravel()}" 
        />
      </div>
      <!--ここまでエラーと入力フォームのコンテナ-->
      
      <!--検索結果のホテルのリスト-->
      <HotelsList
        :allHotelData="allHotelData"
        @hotelDataNum="(num) => {
          getDetails(num)}"
      />
    </div>
    <!--ここまで右側エリア-->
  </div>
</template>

<style scoped>
</style>