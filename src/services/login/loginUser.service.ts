import { compare } from "bcryptjs";
import AppDataSource from "../../data-source";
import User from "../../entities/user.entity";
import AppError from "../../errors/AppError";
import ILoginRequest from "../../interfaces/login.interfaces";
import jwt from "jsonwebtoken";
import "dotenv/config";

const loginUserService = async (data: ILoginRequest): Promise<string> => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: [{ email: data.email }, { cpf: data.cpf }],
    relations: {
      account: true,
    },
    withDeleted: true,
  });

  if (!user) {
    throw new AppError("Incorrect user", 400);
  }

  const passwordMatch = await compare(data.password, user.password);

  if (!passwordMatch) {
    throw new AppError("Incorrect user", 400);
  }

  if (!user.isActive) {
    throw new AppError("Confirm your email", 401);
  }

  const token = jwt.sign(
    {
      account: user.account.id,
      adm: user.isAdmin,
    },
    process.env.SECRET_KEY,
    {
      subject: String(user.id),
      expiresIn: "72h",
    }
  );

  return token;
};

export default loginUserService;
