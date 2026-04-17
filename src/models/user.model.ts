import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { RegisterUserInput, SafeUser, User, UserRole } from "../types";

type UserRow = RowDataPacket & User;

const mapBoolean = (value: boolean | number): boolean => {
  return Boolean(value);
};

const mapUser = (row: UserRow): User => {
  return {
    id: row.id,
    full_name: row.full_name,
    date_of_birth: row.date_of_birth,
    email: row.email,
    password: row.password,
    role: row.role,
    is_active: mapBoolean(row.is_active),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

export const toSafeUser = (user: User): SafeUser => {
  return {
    id: user.id,
    full_name: user.full_name,
    date_of_birth: user.date_of_birth,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.execute<UserRow[]>(
    "SELECT * FROM users WHERE email = :email LIMIT 1",
    { email }
  );

  if (rows.length === 0) {
    return null;
  }

  return mapUser(rows[0]);
};

export const findUserById = async (id: number): Promise<User | null> => {
  const [rows] = await db.execute<UserRow[]>(
    "SELECT * FROM users WHERE id = :id LIMIT 1",
    { id }
  );

  if (rows.length === 0) {
    return null;
  }

  return mapUser(rows[0]);
};

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await db.execute<UserRow[]>(
    "SELECT * FROM users ORDER BY id ASC"
  );

  return rows.map(mapUser);
};

export const createUser = async (
  input: RegisterUserInput,
  hashedPassword: string
): Promise<number> => {
  const role: UserRole = "user";

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users
      (full_name, date_of_birth, email, password, role, is_active)
     VALUES
      (:fullName, :dateOfBirth, :email, :password, :role, TRUE)`,
    {
      fullName: input.full_name,
      dateOfBirth: input.date_of_birth,
      email: input.email,
      password: hashedPassword,
      role
    }
  );

  return result.insertId;
};

export const blockUserById = async (id: number): Promise<boolean> => {
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE users SET is_active = FALSE WHERE id = :id",
    { id }
  );

  return result.affectedRows > 0;
};
