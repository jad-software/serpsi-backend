import { Repository } from "typeorm";
import { Bill } from "../../domain/entities/bill.entity";
import { GetBillsFromPsi } from "./get-bills-from-psi";

describe("GetBillsFromPsi", () => {
  let mockRepository: jest.Mocked<Repository<Bill>>;
  let mockQueryBuilder: any;

  beforeEach(() => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };

    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    } as any;
  });

  it("should call repository with correct parameters", async () => {
    const userId = "test-user-id";
    await GetBillsFromPsi(userId, mockRepository);

    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("bill");
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      "bill.user_id = :user_id",
      { user_id: userId }
    );
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("bill.dueDate", "ASC");
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
  });

  it("should return bills from repository", async () => {
    const expectedBills = [
      { id: 1, user_id: "test-user-id", dueDate: new Date() },
      { id: 2, user_id: "test-user-id", dueDate: new Date() }
    ];
    mockQueryBuilder.getMany.mockResolvedValue(expectedBills);

    const result = await GetBillsFromPsi("test-user-id", mockRepository);

    expect(result).toEqual(expectedBills);
  });

  it("should handle empty results", async () => {
    mockQueryBuilder.getMany.mockResolvedValue([]);

    const result = await GetBillsFromPsi("test-user-id", mockRepository);

    expect(result).toEqual([]);
  });

  it("should propagate errors from repository", async () => {
    const error = new Error("Database error");
    mockQueryBuilder.getMany.mockRejectedValue(error);

    await expect(GetBillsFromPsi("test-user-id", mockRepository))
      .rejects
      .toThrow(error);
  });
});