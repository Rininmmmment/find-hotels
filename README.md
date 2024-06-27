# find-hotels
楽天トラベルに掲載されたホテルを探すことができるアプリです。<br>
https://osushicat.sakura.ne.jp/

## 使用したもの
- Vue.js + Vite
- tailwindCSS / daisyUI
- Google Custom Search
- 楽天トラベル施設検索API
- HeartRails Express API
- さくらのレンタルサーバー

## Demo
### ホテルの検索
![demo](https://private-user-images.githubusercontent.com/101512834/343639899-2f4003fd-a0c3-4502-a454-bef0771fa79d.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTk0NjU5MDcsIm5iZiI6MTcxOTQ2NTYwNywicGF0aCI6Ii8xMDE1MTI4MzQvMzQzNjM5ODk5LTJmNDAwM2ZkLWEwYzMtNDUwMi1hNDU0LWJlZjA3NzFmYTc5ZC5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYyN1QwNTIwMDdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mZGFlYTEwODkyMGNlOWZlZDBkNmY1Mjc2MWI4YzhiZTA1OGU0N2QyY2MwOTUxN2ZlNDk2ZWJmMTBlNzg1ZjhhJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.VISy44anDHnlrXcO04hHeBPM1Q72MG7TTscWpPFmjkM)

### ホテル詳細の表示
![demo](https://private-user-images.githubusercontent.com/101512834/343639912-cc43cb84-244f-42bd-b87d-c5daf074453a.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTk0NjU5MDcsIm5iZiI6MTcxOTQ2NTYwNywicGF0aCI6Ii8xMDE1MTI4MzQvMzQzNjM5OTEyLWNjNDNjYjg0LTI0NGYtNDJiZC1iODdkLWM1ZGFmMDc0NDUzYS5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYyN1QwNTIwMDdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02NTJiY2ExNWUwMWU3ODkxZjIyYTI3YjZmNjJlZWViODE1N2ZhMjU2ZGZkNWNiZGU5ZTk3MjkzZDM3YzdlOTVjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.oMGsqpUqjm7DWMm3fvkdbV6c_wawmuySt3CGpiOMQBk)