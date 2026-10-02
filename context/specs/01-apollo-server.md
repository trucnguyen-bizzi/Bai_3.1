# Unit 01: Apollo Server

## Goal

Một server GraphQL chạy bằng Apollo Server 5, có query `hello`, truy cập được qua HTTP (mặc định cổng 4000)
và kiểm thử được mà không cần mở cổng mạng. Đáp ứng yêu cầu đề số 1.

## Design

Hợp đồng API của unit này (SDL):

```graphql
type Query {
  hello: String!
}
```

`hello` trả về đúng chuỗi `Xin chào GraphQL!`.

## Implementation

### `src/typeDefs.js`
Default export một template literal chứa SDL ở trên, dòng đầu là chú thích `#graphql`.

### `src/resolvers.js`
Default export object `{ Query: { hello } }`. `hello` trả về chuỗi cố định.

### `src/createServer.js`
Default export hàm `createServer()` trả về `new ApolloServer({ typeDefs, resolvers, ... })` với
`includeStacktraceInErrorResponses: false`. Tách khỏi việc mở cổng để test không cần mạng.

### `src/index.js`
Dùng `startStandaloneServer` từ `@apollo/server/standalone`. Cổng lấy từ `Number(process.env.PORT)`, mặc định
`4000`. In ra URL khi sẵn sàng. (Apollo Server 5: server standalone không dùng Express.)

### `test/helpers.js`
Named export `run(query, { variables, contextValue })`:
- tạo server bằng `createServer()`, gọi `server.executeOperation({ query, variables }, { contextValue })`;
- kiểm tra `body.kind === "single"`;
- trả về bản sao thuần qua `JSON.parse(JSON.stringify(singleResult))` (kết quả GraphQL là object không có
  prototype nên `assert.deepEqual` chặt sẽ so sánh sai nếu không chuẩn hóa).
`contextValue` mặc định là `{}`.

### `test/unit01-server.test.js`
Dùng `node:test` và `node:assert/strict`.

## Dependencies

- `@apollo/server` (server GraphQL)
- `graphql` (bắt buộc đi kèm Apollo Server)

Cài: `npm install @apollo/server graphql`

## Verify when done

- [ ] Test: `{ hello }` trả `Xin chào GraphQL!`, không có `errors`
- [ ] Test: query một trường không tồn tại (`{ khongTonTai }`) bị từ chối (có `errors`)
- [ ] `npm test` chỉ chạy các file `*.test.js` (`helpers.js` không bị tính là test)
- [ ] `npm start` rồi `curl -X POST http://localhost:4000/ -H "Content-Type: application/json" -d '{"query":"{ hello }"}'` trả đúng chuỗi
- [ ] `npm run check` pass
- [ ] Không cài package nào ngoài mục Dependencies
