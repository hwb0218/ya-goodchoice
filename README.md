# 📌 GoodChoice      
`숙소 예약 서비스 개인 프로젝트`     
> [GoodChoice](http://www.goodchoice.gq/){:target="_blank"}
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
- Node.js
- MySQL
- Express
- AWS

</br>

## 3. ERD 설계

![ERD1](https://user-images.githubusercontent.com/52212226/108705980-5263b900-7551-11eb-8867-ac3810323b01.PNG)

## 4. 주요 기능
이 서비스의 핵심 기능은 사용자가 원하는 숙소의 옵션과 날짜를 선택하여 예약, 수정, 취소하는 기능입니다. 

## 5. 트러블 슈팅
### 속성으로 객체를 분류하여 생긴 문제 
- SQL Query문 사용법에 대해 미숙했기 때문에 여러개의 Query를 사용해 각 테이블의 데이터를 불러왔고      
  자바스크립트로 원하는 형태의 데이터로 가공해야 했습니다.
- DB의 reservation 테이블에서 가져온 데이터에는 MOTEL_ID 또는 HOTEL_ID 라는 속성이 공통적으로 존재하고
  reduce 함수를 이용해 동일한 속성을 가진 객체들끼리 분류를 하였습니다.
  
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
  
- 그런데 다른 날짜의 동일한 숙소 또한 공통 속성을 가지고 있어서 예약했을 때 
  새로운 예약 리스트가 추가되지 않고 기존에 예약했던 동일한 숙소의 날짜가 바뀌는 문제가 발생했습니다.  
- 때문에 SQL 문법으로 해결할 수 있지 않을까 하는 생각에 검색을 하며 데이터를 그룹화하는 방법이 있나 찾아본 결과        
  GROUP BY절로 해결할 수 있다는 것을 알아냈습니다.     
  
  >__hotel·motel_reservation 테이블에 GROUP_OF_ROOMS 열을 추가했고 GROUP_BY절을 사용해       
  >같은 숫자를 가지고 있으면 그룹화 시켜줬습니다.__

