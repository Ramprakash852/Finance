const { TransactionRepository } = require("./transaction.repository");
const { AppError } = require("../../utils/errors");

const repo = new TransactionRepository();

class TransactionService {
  // Normalize incoming dates before the repository writes them.
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
    // Preserve existing row checks, then convert date strings only when provided.
    return repo.update(id, { ...data, ...(data.date && { date: new Date(data.date) }) });
  }

  async delete(id) {
    await this.getById(id);
    // Deletions are soft deletes so historical reports stay intact.
    return repo.softDelete(id);
  }
}

module.exports = {
  TransactionService,
};
