const express = require("express");

// 프로토콜을 구현하기 위한 라이브러리 실시간 양방향 통신을 해줌
const { WebSocketServer } = require("ws");


const app = express();

// public 디렉토리 내의 정적 파일(html, css, js)을 클라이언트에 제공
app.use(express.static("public"));

// 8000번 포트에서 HTTP 서버 시작
app.listen(8000, () => {
    console.log(`Example app listening on port 8001`)
});

// wss는 웹소켓 서버 인스턴스, 웹소켓 서버를 생성하고 관리하는 역할
// ws는 클라이언트의 개별 웹소켓연결, 클라이언트가 서버에 연결될 때마다 생성

// 8001번 포트에서 웹소켓 서버를 생성, 클라이언트와의 실시간 통신을 처리
const wss = new WebSocketServer({ port: 8000 });

// 연결된 모든 클라이언트에게 메시지 전송
wss.broadcast = (message) => {
    // wss.clients: 현재 연결된 모든 클라이언트를 포함하는 Set 객체
    // 모든 클라이언트를 순회하면서 각 클라이언트에게 메시지 전송
    wss.clients.forEach((client) => {
        client.send(message);
    });
};

// 새로운 클라이언트가 웹소켓 서버에 연결될 때 호출되는 이벤트 핸들러
wss.on("connection", (ws) => {
    // 연결된 클라이언트 수를 포함한 메시지를 모든 클라이언트에게 브로드캐스트
    // 브로드캐스트: 서버가 모든 클라이언트한테 메시지를 동시에 전송
    wss.broadcast(
        `새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`
    );

    // 클라이언트가 서버로 메시지를 보낼 때 호출되는 이벤트 핸들러
    ws.on("message", (data) => {
        // 수신한 메시지를 모든 클라이언트에게 브로드캐스트
        wss.broadcast(data.toString());
    });

    // 클라이언트가 연결을 종료할 때 호출되는 이벤트 핸들러
    ws.on("close", () => {
        // 연결이 종료된 후 현재 연결된 클라이언트 수를 포함한 메시지를 모든 클라이언트에게 브로드캐스트
        wss.broadcast(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
    });
})



