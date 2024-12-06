import { Repository } from "typeorm";
import { Meeting } from "../../domain/entities/meeting.entity";
import { getSchedule } from "./get-schedule";

describe("getSchedule", () => {
  let mockRepository: jest.Mocked<Repository<Meeting>>;
  let mockQueryBuilder: any;

  beforeEach(() => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getRawMany: jest.fn()
    };

    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    } as any;
  });

  it("should get schedule with only start date", async () => {
    const startDate = new Date("2024-01-01");
    const expectedEndDate = new Date("2024-01-02");
    
    await getSchedule({
      psychologistId: "123",
      startDate
    }, mockRepository);

    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("meeting");
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      "meeting.Psychologist_id = :psychologistId",
      { psychologistId: "123" }
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "meeting._schedule >= :startDate",
      { startDate }
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "meeting._schedule <= :endDate",
      { endDate: expectedEndDate }
    );
  });

  it("should get schedule with start and end date", async () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-01-03");
    
    await getSchedule({
      psychologistId: "123",
      startDate,
      endDate
    }, mockRepository);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "meeting._schedule <= :endDate",
      { endDate }
    );
  });

  it("should return full entities when isEntity is true", async () => {
    const mockMeetings = [{ id: 1 }, { id: 2 }];
    mockQueryBuilder.getMany.mockResolvedValue(mockMeetings);

    const result = await getSchedule({
      psychologistId: "123",
      startDate: new Date(),
      isEntity: true
    }, mockRepository);

    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    expect(result).toEqual(mockMeetings);
  });

  it("should return selected fields when isEntity is false", async () => {
    const mockRawMeetings = [
      { meeting__id__id: 1, meeting__schedule: new Date() },
      { meeting__id__id: 2, meeting__schedule: new Date() }
    ];
    mockQueryBuilder.getRawMany.mockResolvedValue(mockRawMeetings);

    const result = await getSchedule({
      psychologistId: "123",
      startDate: new Date(),
      isEntity: false
    }, mockRepository);

    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      "meeting._id._id",
      "meeting._schedule",
      "meeting._status",
      "patient._id._id",
      "person._name",
    ]);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("meeting._schedule", "ASC");
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
    expect(result).toEqual(mockRawMeetings);
  });

  it("should join patient and person tables", async () => {
    await getSchedule({
      psychologistId: "123",
      startDate: new Date()
    }, mockRepository);

    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith("meeting._patient", "patient");
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith("patient._person", "person");
  });
});