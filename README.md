# 📌 GoodChoice      
> __숙소 예약 서비스 개인 프로젝트__     
> [GoodChoice](http://www.goodchoice.gq/)

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
- Third-party-library (jwt, bcrypt 등)

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

## 6. 느낀점
첫 개인 프로젝트를 끝마치고 순간순간의 기억들이 떠오릅니다.     
'만들긴 만들어야 하는데 어디서 부터 시작하지? 이럴땐 뭘 어떻게 해야할까?       
왜 안되는거야? 도대체 뭐가 문제야? 문제를 해결했더니 다른 문제가 생기네?'    
이런 생각들을 매일매일하고 구글링을 하며 차근차근 문제를 해결해 나갔습니다.       
이러한 고민들 덕분에 느낀것이 적절한 키워드를 조합하여 검색하면       
내가 겪고있는 대부분의 문제들을 해결 할 수 있다는 것을 깨달았습니다.      

힘들고 머리도 아프고 생각을 많이 하다보니 머리가 멍해지기도 하고 힘듦과 고통의 연속이였지만,      
완성 후 가족과 친구들에게 내가 만든 서비스라며 보여주니 신기하다, 잘 만들었다, 고생했다라는 말 한마디가        
고생하며 만든 보람이 있구나 뿌듯했습니다.

첫 프로젝트라 미숙한 부분도 많고 코드도 지저분 하겠지만 이런 경험이 좋은 개발자가 되자는 나의 목표에        
다가가고 있는것이라 다시한번 생각하며 끝으로 나에게 수고하고 있고 계속 열심히 하자는 말을 하고 싶습니다.
