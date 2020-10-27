# OkCert_Nodejs
OkCert의 인증서비스를 Nodejs로 구성했봤습니다.

준비물 :
-----
jdk 1.8.x버전 (jdk8 버전) 저는 openjdk를 사용했습니다. https://github.com/ojdkbuild/ojdkbuild
java library (npm install java)  설치가 안될경우 하단의 "java설치오류" 확인
express 또는 그외의 web framwork (npm install express)
ejs 또는 그외의 express render library (npm install ejs)
Kcb에게 받은 배포파일 (라이센스파일 // OkCert파일)

java설치오류
-----
저도 겪었습니다.(linux사용중이면 거의 무조건 나타날껍니다.) node-gyp를 global로 설치를합니다. (npm install -g node-gyp)
설치가 완료되었다면 npm install java를 다시해줍니다.
>>그외의 오류는 모릅니다.


사용법:
-----
git을 다운받거나 코드를 복붙해서

kcb.html은 설정한 views폴더에 넣으시고

요청받을 주소를 정의합니다. 예제는 /kcb (get)
요청받은 주소에 mdl_tkn값이 없으면 팝업창을 띄워 본인인증을 진행 (전달값 cp_cd는 고객사 코드)
>> ※mdl_tkn은 kcb_init함수로 전달받은 값임 이과정없이 아래의 과정을 거치면 오류발생)

mdl_tkn값이 있다면 결괏값을 받기위해 kcb_result 함수에 mdl_tkn값전달
결과값 반환 (본인인증을 했다면 RSLT_CD 가 b000인 값이 나옵니다.)
