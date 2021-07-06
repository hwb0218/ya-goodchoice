# 📌 Good choice      
__`숙소 예약 서비스`__
> Demolink      
> [GoodChoice](http://3.36.140.38/)

</br>

## 1. 제작 기간
- 2020년 11월 ~ 2020년 02월
- 개인 프로젝트

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
- AWS (EC2, RDS)
- Third-party-library (jwt, bcrypt 등)

</br>

## 3. ERD 설계

![ERD](https://user-images.githubusercontent.com/52212226/120278724-986aae80-c2f0-11eb-8f05-eb3a753aa1d3.png)

## 4. 주요 기능
이 서비스의 주요 기능은 사용자가 원하는 숙소의 옵션과 날짜를 선택하여 예약, 수정, 취소하는 기능입니다.

<details>
<summary><b>🎞주요 기능 영상 펼치기</b></summary>
<div markdown="1">
  
### 4.1 선택 옵션에 맞는 숙소 보여주기
![옵션선택](https://user-images.githubusercontent.com/52212226/120186707-ce575680-c24e-11eb-8bb3-f41e37e6c5d4.gif)
### 4.2 가격 순 정렬
![가격정렬](https://user-images.githubusercontent.com/52212226/120275388-2e500a80-c2ec-11eb-87aa-034465f50ffe.gif)
### 4.3 방 예약하기
![방예약](https://user-images.githubusercontent.com/52212226/120275676-a6b6cb80-c2ec-11eb-9072-9b9346b7fdbb.gif)
### 4.4 예약 날짜 변경
![예약날짜변경](https://user-images.githubusercontent.com/52212226/120275975-0ca35300-c2ed-11eb-88db-1bc1dca07914.gif)
### 4.5 예약 취소
![예약취소](https://user-images.githubusercontent.com/52212226/120277043-7bcd7700-c2ee-11eb-87cd-290babeda142.gif)
  
</div>
</details>

</br>  

## 5. 트러블 슈팅
### 동일 속성으로 객체를 분류하여 생긴 문제 
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
 
 </br>

## 6. 마치며

첫 개인 프로젝트를 끝마치고 순간순간의 기억들이 떠오릅니다.     
'만들긴 만들어야 하는데 어디서부터 시작하지? 이럴 땐 뭘 어떻게 해야 할까?     
왜 안 되는 거야? 도대체 뭐가 문제야? 문제를 해결했더니 다른 문제가 생기네?'     
이런 생각들을 매일매일하고 구글링하며 차근차근 문제를 해결해 나갔습니다.      
이러한 고민 덕분에 느낀 것이 적절한 키워드를 조합하여 구글링하면      
내가 겪고 있는 대부분의 문제를 해결할 수 있다는 것을 깨달았습니다.      

힘들고 머리도 아프고 생각을 많이 하다 보니 머리가 멍해지기도 하고 피곤함과 졸림의 연속이었지만,     
완성 후 가족과 친구들에게 내가 만든 서비스라며 보여주니 신기하다, 잘 만들었다, 고생했다는 말 한마디가      
'고생하며 만든 보람이 있구나!' 뿌듯함을 느낍니다.            
첫 프로젝트라 미숙한 부분도 많고 코드도 지저분하겠지만 이런 경험이 좋은 개발자가 되자는 나의 목표에      
다가가고 있는 것이라 다시 한 번 생각하며 끝으로 나에게 수고하고 있고 계속 열심히 하자는 말을 하고 싶습니다.
