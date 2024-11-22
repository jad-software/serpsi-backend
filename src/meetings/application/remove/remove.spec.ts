import { Repository } from "typeorm";
import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { remove } from "./remove";

describe("remove", () => {
  let mockRepository: jest.Mocked<Repository<Meeting>>;

  beforeEach(() => {
    mockRepository = {
      delete: jest.fn(),
    } as any;
  });

  it("should successfully delete a meeting when valid id is provided", async () => {
    const meetingId = "123";
    mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

    const result = await remove(meetingId, mockRepository);

    expect(mockRepository.delete).toHaveBeenCalledWith(meetingId);
    expect(result.affected).toBe(1);
  });

  it("should return affected: 0 when meeting with id does not exist", async () => {
    const nonExistentId = "456";
    mockRepository.delete.mockResolvedValue({ affected: 0 } as any);

    const result = await remove(nonExistentId, mockRepository);

    expect(mockRepository.delete).toHaveBeenCalledWith(nonExistentId);
    expect(result.affected).toBe(0);
  });

  it("should throw an error when repository delete fails", async () => {
    const meetingId = "789";
    const error = new Error("Database error");
    mockRepository.delete.mockRejectedValue(error);

    await expect(remove(meetingId, mockRepository)).rejects.toThrow("Database error");
    expect(mockRepository.delete).toHaveBeenCalledWith(meetingId);
  });
});
