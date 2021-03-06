# APIs
```
POST    "/api/user"                            회원 등록
DELETE  "/api/user"                            회원 탈퇴
GET     "/api/user"                            유저 읽기 (복수) // docu 작성하슈
GET     "/api/user/:id"                        유저 디테일
PUT     "/api/user/:id"                        유저 디테일 변경
GET     "/api/user/profile"                    내 정보
PUT     "/api/user/profile"                    내 정보 변경
POST    "/api/user/login"                      로그인
GET     "/api/user/logout"                     로그아웃
GET     "/api/user/rank/:id"                   내 랭크
```
<br>

# User Model Schema
```js
var UserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
        maxlength: 50
    },
    nickName: {
        type: String,
        maxlength:50,
        default:this.name,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        default: 100 //
    },
    battings: { // populate 로 바꿔야할 듯하다.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batting'
    }
});

UserSchema.virtual('battings', {
    ref: 'Batting',
    localField: '_id',
    foreignField: 'user'
});
```
<br>

# API Spec

## __회원 등록__ POST "/api/user"
__Request__
```
method: POST
url: "api/user"
header: { 
    "Content-Type": "application/json" 
}
body: {
    "email": "jordan@gamil.com",
    "password": "hashedpasswrod",
    "name": "michel jordan",
    "nickname": "basketballgot"
}
```
__Response__
```
{
    "success": true,
    "token: "token value"
}
```
<br>

## __회원 탈퇴__ DELETE  "/api/user/"
__Request__
```
method: DELETE
url: "api/user/withdrawal"
header: { 
    "Content-Type": "application/json" 
}
```
__Response__
```
{
    "success": true,
    "data": []
    
}
```
<br>

## __유저 읽기 (복수)__ 
- 보여주는 개수는 50개입니다.
- point 높은 순으로 보여줍니다.

__Request__
```
method: GEt
url: "/api/user"
header: {"Content-Type": "application/json"  }
}
```

__Response__
```
{
    "success": true,
    "data": [
        {
            "point": 101,
            "_id": "5f45f2538297404534899dfc",
            "email": "user2@naver.com",
            "password": "hashedpassword",
            "name": "user2",
            "nickname": "user2",
            "__v": 0
        },
        {
            "point": 100,
            "_id": "5f45f2538297404534899dfb",
            "email": "user1@naver.com",
            "password": "hashedpassword",
            "name": "user1",
            "nickname": "user1",
            "__v": 0
        },
        {
            "point": 100,
            "_id": "5f45f2538297404534899dfd",
            "email": "user3@naver.com",
            "password": "hashedpassword",
            "name": "user3",
            "nickname": "user3",
            "__v": 0
        },
        ~~
    ]
}
```

<br>

## __유저 디테일__ GET  "/api/user/:id"
__Request__
```
method: GET
url: "api/user/detail/:id"
header: { 
    "Content-Type": "application/json" 
}
```
__Response__
```
{
    "success": true,
    "rank": 6
    "data": {
        "point": 100,
        "_id": "5f47a45a1b593145547abd33",
        "email": "user5@naver.com",
        "password": "$2a$10$yNQm6Imqg4fz.6taUQk/cutZn7ftdBIVwAu2DnELdQ9vWm41m3dwu",
        "name": "kimmm",
        "nickname": "dsfhekl",
        "__v": 0,
        "battings": [
            {
                "result": "Not Finished",
                "_id": "5f47a4b31b593145547abd34",
                "user": "5f47a45a1b593145547abd33",
                "match": "5f47453c44a5554804a8387a",
                "chooseHomeAwayDraw": "Home",
                "battingPoint": 10,
                "createdAt": "2020-08-27T12:18:59.241Z",
                "__v": 0
            },
            {
                "result": "Not Finished",
                "_id": "5f4b496dc8ea5c0d0897ba87",
                "user": "5f47a45a1b593145547abd33",
                "match": "5f4a3e2d60d7215bd4bd3310",
                "chooseHomeAwayDraw": "Home",
                "battingPoint": 12,
                "createdAt": "2020-08-30T06:38:37.650Z",
                "__v": 0
            }
        ],
        "id": "5f47a45a1b593145547abd33"
    }
}
```
<br>


## __유저 디테일 변경__ PUT  "/api/user/:id"
__Request__
```
method: PUT
url: "api/user/detail/:id"
header: { 
    "Content-type": "application/json", 
    "x-access-token": "token Value"}
body: { "nickname": "jason" }
```
__Response__
```
{
    "success": true,
    "data": {
        "point": 100,
        "_id": "asdfhlk68242jklshdklfdsfrehwe",
        "email": "jordan@gamil.com",
        "password": "hashedpasswrod",
        "name": "michel jordan",
        "nickname": "jason"    // changed from "basketballgot" to "jason"
    }    
}
```
<br>

## __내 정보__ GET  "/api/user/profile"
__Request__
```
method: GET
url: "api/user/profile/"
header: { 
    "Content-Type": "application/json", 
    "x-access-token": "token Value" 
}

```
__Response__
```
{
    "success": true,
    "rank": 6,
    "data": {
        "point": 100,
        "_id": "5f47a45a1b593145547abd33",
        "email": "user5@naver.com",
        "password": "$2a$10$yNQm6Imqg4fz.6taUQk/cutZn7ftdBIVwAu2DnELdQ9vWm41m3dwu",
        "name": "kimmm",
        "nickname": "dsfhekl",
        "__v": 0,
        "battings": [
            {
                "result": "Not Finished",
                "_id": "5f47a4b31b593145547abd34",
                "user": "5f47a45a1b593145547abd33",
                "homeTeamName" : ~~~~,
                "awayTeamName" : ~~~~,
                "chooseHomeAwayDraw": "Home",
                "battingPoint": 10,
                "createdAt": "2020-08-27T12:18:59.241Z",
                "reward" : 100,
                "__v": 0
            },
        ],
        "id": "5f47a45a1b593145547abd33"
    }
}
```
<br>

## __내 정보 변경__ PUT  "/api/user/profile/"
__Request__
```
method: PUT
url: "api/user/profile/"
header: { 
    "Content-type": "application/json", 
    "x-access-token": "token Value"}
body: { "nickname": "jason" }
```
__Response__
```
{
    "success": true,
    "data": {
        "point": 100,
        "_id": "asdfhlk68242jklshdklfdsfrehwe",
        "email": "jordan@gamil.com",
        "password": "hashedpasswrod",
        "name": "michel jordan",
        "nickname": "jason"    // changed from "basketballgot" to "jason"
    }    
}
```

<br>

## __로그인__ POST "/api/user/login"
__Request__
```
method: POST
url: "api/user/
header: {
    "Content-Type": "application/json" 
}
body: {
    "email": "jordan@gamil.com",
    "password": "hashedpasswrod"
}
```
__Response__
```
{
    "success": true,
    "token": "sdghkle62fdhl2229fkfsdl232112hj4jkljklfsdjfdsfdslasd"
}
```
<br>

// 로그아웃은 프론트에서만 처리하면 되는거 아닌가 ??
## __로그아웃__ GET  "/api/user/logout"
__Request__
```
method: GET
url: "api/user/logout"
header: { 
    "Content-Type": "application/json"
}
```
__Response__
```
{
    "success": true,
    "data": []
}
```

## __내 랭크__ GET "/api/user/rank/:id"

__Request__
```
method: GET
url: "/api/user/rank/:id"
header: {
    "Content-Type": "application/json"
}
```

__Response__
```
{
    success: true,
    ranking: 1
}
```