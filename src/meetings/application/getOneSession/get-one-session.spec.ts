import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { getOneSession } from "./get-one-session";

describe("getOneSession", () => {
  let mockRepository: any;
  
  beforeEach(() => {
    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOneOrFail: jest.fn()
    } as any;
  });

  it("should get one session with all relations", async () => {
    // Arrange
    const sessionId = "test-session-id";
    const expectedMeeting = new Meeting();
    mockRepository.getOneOrFail.mockResolvedValue(expectedMeeting);

    // Act
    const result = await getOneSession(sessionId, mockRepository);

    // Assert
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("meeting");
    expect(mockRepository.where).toHaveBeenCalledWith("meeting.id = :sessionId", { sessionId });
    expect(mockRepository.leftJoinAndSelect).toHaveBeenCalledWith("meeting._patient", "patient");
    expect(mockRepository.leftJoinAndSelect).toHaveBeenCalledWith("patient._person", "patient_person");
    expect(mockRepository.leftJoinAndSelect).toHaveBeenCalledWith("patient._parents", "patient_parents");
    expect(mockRepository.getOneOrFail).toHaveBeenCalled();
    expect(result).toBe(expectedMeeting);
  });

  it("should throw error when session is not found", async () => {
    // Arrange
    const sessionId = "non-existent-id";
    mockRepository.getOneOrFail.mockRejectedValue(new Error("Session not found"));

    // Act & Assert
    await expect(getOneSession(sessionId, mockRepository))
      .rejects
      .toThrow("Session not found");
  });
});