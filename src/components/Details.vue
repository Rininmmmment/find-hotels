<script setup>
  defineProps({
    searchWords: {
      type: Array,
      required: true,
    },
    selectedHotelRoomImgUrl: {
      type: Array,
      required: true,
    },
    selectedHotelInfo: {
      type: Array,
      required: true,
    },
    getDetailsError: {
      type: String,
      required: true,
    }
  })
</script>

<template>
  <dialog id="my_modal_1" class="modal w-11/12">
    <div class="modal-box">
      <!--中身-->
      <div class="mx-auto lg:p-10" v-if="selectedHotelInfo">
        <!--ホテル情報コンテナ-->
        <div class="mb-20">
          <!--画像のコンテナ-->
          <div class="divider divider-primary">Hotel Images by Google Search</div>
          <div v-if="getDetailsError !== ''" role="alert" class="alert alert-error p-0">
            <div role="alert" class="alert alert-error mx-auto p-3">
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
</template>

<style scoped>
</style>