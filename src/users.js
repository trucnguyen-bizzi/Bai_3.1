import bcrypt from "bcryptjs";

const users = [
  {
    id: "1",
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    fullName: "Quản Trị Viên",
    email: "admin@example.com",
    phone: "0900000001",
    role: "ADMIN",
  },
  {
    id: "2",
    username: "an",
    password: bcrypt.hashSync("123456", 10),
    fullName: "Nguyễn Văn An",
    email: "an@example.com",
    phone: "0900000002",
    role: "USER",
  },
  {
    id: "3",
    username: "binh",
    password: bcrypt.hashSync("123456", 10),
    fullName: "Trần Thị Bình",
    email: "binh@example.com",
    phone: "0900000003",
    role: "USER",
  },
];

export default users;
