import AppDataSource from "../../data-source";
import Account from "../../entities/account.entity";
import Transference from "../../entities/transference.entity";
import AppError from "../../errors/AppError";
import { ITransferRequest } from "../../interfaces/transfer.interfaces";

const createTransferService = async (
    dataTransfer: ITransferRequest,
    senderAccountId: number,
    receivedAccountId: number
): Promise<Transference> => {
    const transferRepo = AppDataSource.getRepository(Transference);
    const accountRepo = AppDataSource.getRepository(Account);

    const receiverAccount = await accountRepo.findOneBy({
        id: receivedAccountId,
    });

    if (!receiverAccount) {
        throw new AppError("account not found", 404);
    }

    const senderAccount = await accountRepo.findOneBy({ id: senderAccountId });

    if (+senderAccount.money < dataTransfer.value) {
        throw new AppError("insufficient money", 401);
    }

    if (dataTransfer.date) {
        const newDate = new Date(dataTransfer.date);
        dataTransfer.date = newDate.toISOString().split("T")[0];
    }

    const newTransfer = transferRepo.create({
        ...dataTransfer,
        receiverAccountId: receivedAccountId,
        senderAccount: senderAccount,
    });
    await transferRepo.save(newTransfer);

    return newTransfer;
};

export default createTransferService;
