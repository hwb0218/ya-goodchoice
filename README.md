# 📌 GoodChoice      
`숙소 예약 서비스 개인 프로젝트`     
데모링크 여기에

</br>

## 1. 제작 기간
2020년 11월 ~ 2020년 02월

</br>

## 2. 사용 기술
#### `Front-end`
- Javascript ES6+
- Pug
- CSS
#### `Back-end`
- Node.js 14.13.1
- MySQL 8.0.21
- Express 4.17.1

</br>

## 3. ERD 설계
![ERD](https://user-images.githubusercontent.com/52212226/108475000-7c0fac80-72d3-11eb-88e8-c38f49a868d6.PNG)

## 4. 핵심 기능
이 서비스의 핵심 기능은 사용자가 원하는 옵션, 날짜를 선택하고 숙소를 예약하는 기능입니다. 

## 5. 트러블 슈팅
### 5.1 속성으로 객체를 분류하여 생긴 문제 
- 동일한 숙소를 다른 날짜로 예약했을 때 예약 리스트가 추가되지 않고       
  기존에 있던 동일한 숙소의 날짜가 바뀌는 문제가 발생했습니다.

<details>
<summary><b>기존 코드</b></summary>
<div markdown="1">
  
```javascript
console.log('1');
```

</div>
</details>  
