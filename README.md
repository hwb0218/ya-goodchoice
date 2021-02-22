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

![ERD1](https://user-images.githubusercontent.com/52212226/108705980-5263b900-7551-11eb-8867-ac3810323b01.PNG)

## 4. 핵심 기능
이 서비스의 핵심 기능은 사용자가 원하는 옵션, 날짜를 선택하고 숙소를 예약하는 기능입니다. 

## 5. 트러블 슈팅
### 5.1 속성으로 객체를 분류하여 생긴 문제 
- SQL Query문 사용법에 대해 미숙했기 때문에 여러개의 Query를 사용해 각 테이블의 데이터를 불러왔고      
  자바스크립트로 원하는 형태의 데이터로 가공해야 했습니다.
- DB의 reservation 테이블에서 가져온 데이터에는 MOTEL_ID 또는 HOTEL_ID 라는 속성이 공통적으로 존재하고
  이것을 이용해 객체 분류를 하였습니다.
  
  <details>
  <summary><b>코드</b></summary>
  <div markdown="1">
    
  ```javascript
  const groupBy = (objectArray, property) => {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        !acc[key] ? acc[key] = [obj.RESERVATION_DATE] : acc[key].push(obj.RESERVATION_DATE);
        return acc;
    }, {});
  }
  ```
 
  </div>
  </details>  
  
- 그런데 동일한 숙소를 다른 날짜로 예약했을 때 또한 공통 속성을 가지고 있어서 
  예약 리스트가 추가되지 않고 기존에 예약했던 동일한 숙소의 날짜가 바뀌는 문제가 발생했습니다.

<details>
<summary><b>코드</b></summary>
<div markdown="1">
  
```javascript
console.log('1');
```

</div>
</details>  
