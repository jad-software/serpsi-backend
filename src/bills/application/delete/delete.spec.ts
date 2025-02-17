import { DeleteResult, Repository } from "typeorm";
import { Bill } from "../../domain/entities/bill.entity";
import { Delete } from "./delete";

describe("Delete", () => {
  let mockRepository: jest.Mocked<Repository<Bill>>;

  beforeEach(() => {
    mockRepository = {
      delete: jest.fn(),
    } as any;
  });

  it("should call repository.delete with correct id", async () => {
    // Arrange
    const testId = "test-id";
    mockRepository.delete.mockResolvedValue({ affected: 1 } as DeleteResult);

    // Act
    await Delete(testId, mockRepository);

    // Assert
    expect(mockRepository.delete).toHaveBeenCalledWith(testId);
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });

  it("should return the result from repository.delete", async () => {
    // Arrange
    const testId = "test-id";
    const expectedResult = { affected: 1 } as DeleteResult;
    mockRepository.delete.mockResolvedValue(expectedResult);

    // Act
    const result = await Delete(testId, mockRepository);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it("should throw error if repository.delete fails", async () => {
    // Arrange
    const testId = "test-id";
    const error = new Error("Delete failed");
    mockRepository.delete.mockRejectedValue(error);

    // Act & Assert
    await expect(Delete(testId, mockRepository)).rejects.toThrow(error);
  });
});