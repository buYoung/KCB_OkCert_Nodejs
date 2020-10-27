var java = require('java')
    , ejs = require('ejs')
    , express = require('express')
    , app = express()
    , path = require('path')
    , jardist = path.join(path.resolve("."), "OkCert3-java1.5-2.2.3.jar") // Okcert3파일의 경로
    , licensepath = path.join(path.resolve("."), "Vxxxxxxxxxxx_xxxxxx_xxxx_AES_license.dat") // 배포받은 KCB 라이센스파일 경로
    , CP_CD = "Vxxxxxxxxxxx"; // 패보받은 고객사 코드
java.options.push("--illegal-access=warn") // JAVA WARNING 감추기
java.classpath.push(jardist); // Okcert library 불러오기

function Kcb_init() {
    var json_object = {};
    json_object["RETURN_URL"] = "http://127.0.0.1:3000/Kcb"; // MDL_TKN값 받을 주소
    json_object["SITE_NAME"] = "브레인솔루션"; // 사이트의 보여질 이름
    json_object["SITE_URL"] = "127.0.0.1:3000"; // 서버의 URL
    json_object["RQST_CAUS_CD"] = "00"; // 배포받은 사용설명서 참조

    var okcert_class = java.newInstanceSync("kcb.module.v3.OkCert");
    // nodejs java library로  등록된 okcert library에서 해당되는 클래스를  변수로 선언합니다.
    var okcert_result = java.callMethodSync(okcert_class, "callOkCert", "PROD", CP_CD, "IDS_HS_POPUP_START", licensepath, JSON.stringify(json_object))
    // 변수는 PROD ~ json_object까지이며 자세한건 배포받은 사용설명서 참조
    return JSON.parse(okcert_result); // JSON 데이터 전달 이값들을 이용해서 팝업창에 데이터전달
}

function Kcb_Result(mdl_tkn) { // MDL_TKN값을 받은후
    var okcert_3_class = java.newInstanceSync("kcb.module.v3.OkCert"); // 클래스 변수로선언
    var okcert_3_result = java.callMethodSync(okcert_3_class, "callOkCert", "PROD", CP_CD, "IDS_HS_POPUP_RESULT", licensepath,mdl_tkn)
    // 팝업창으로 인증이끝났다면 이 method로 인증완료결과값을 받음 (1회성)
    return JSON.parse(okcert_3_result)
}

app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile)

app.get('/', (req, res) => {
    res.send("Hello");
})
app.get('/kcb', (req, res) => {
    if (req.query.mdl_tkn !== undefined) {
        var mdl_tkn = {};
        mdl_tkn["MDL_TKN"] = req.query.mdl_tkn;
        var result = Kcb_Result(JSON.stringify(mdl_tkn));

        res.send(result);
    } else {
        var kcb_result_callokcert = Kcb_init(); // phone_popup2
        res.render("kcb.html", {
            CP_CD: kcb_result_callokcert["CP_CD"],
            MDL_TKN: kcb_result_callokcert["MDL_TKN"],
            popupUrl: "https://safe.ok-name.co.kr/CommonSvl"
        })
    }
})


app.listen(3000, () => {
    console.log("Start express server for OkCert")
})
