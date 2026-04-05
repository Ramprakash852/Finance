const { TransactionRepository } = require("./transaction.repository");
const { AppError } = require("../../utils/errors");

const repo = new TransactionRepository();

class TransactionService {
  create(data, userId) {
    return repo.create({
      ...data,
      userId,
      date: new Date(data.date),
    });
  }

  getAll(filters) {
    return repo.findMany(filters);
  }

  async getById(id) {
    const tx = await repo.findById(id);
    if (!tx) {
      throw new AppError("Transaction not found", 404);
    }
    return tx;
  }

  async update(id, data) {
    await this.getById(id);
    return repo.update(id, { ...data, ...(data.date && { date: new Date(data.date) }) });
  }

  async delete(id) {
    await this.getById(id);
    return repo.softDelete(id);
  }
}

module.exports = {
  TransactionService,
};
