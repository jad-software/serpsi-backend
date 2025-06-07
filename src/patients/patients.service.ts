import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Id } from '../entity-base/vo/id.vo';
import { SchoolService } from './school.service';
import { UpdateSchoolDto } from './dto/school/update-school.dto';
import { ComorbiditiesService } from './comorbidities.service';
import { Comorbidity } from './entities/comorbidity.entity';
import { MedicamentInfo } from './entities/medicament-info.entity';
import { MedicamentInfoService } from './medicament-info.service';
import { CreateMedicamentInfoDto } from './dto/medicine/create-medicament-info.dto';
import { CreateComorbidityDto } from './dto/comorbities/create-comorbidity.dto';
import { CreatePersonDto } from '../persons/dto/createPerson.dto';
import { PersonsService } from '../persons/persons.service';
import { CreateSchoolDto } from './dto/school/create-school.dto';
import { DocumentsService } from '../documents/documents.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { School } from './entities/school.entity';
import { Person } from '../persons/entities/person.enitiy';
import { PsychologistsService } from '../psychologists/psychologists.service';
import { Meeting } from '../meetings/domain/entities/meeting.entity';
import { StatusType } from '../meetings/domain/vo/statustype.enum';

@Injectable()
export class PatientsService {
  constructor(
    @Inject(data_providers.PATIENT_REPOSITORY)
    private patientRepository: Repository<Patient>,
    private readonly schoolService: SchoolService,
    private readonly comorbiditiesService: ComorbiditiesService,
    private readonly medicamentInfoService: MedicamentInfoService,
    private readonly personsService: PersonsService,
    @Inject(forwardRef(() => DocumentsService))
    private documentService: DocumentsService,
    @Inject()
    private cloudinaryService: CloudinaryService,
    @Inject()
    private psychologistService: PsychologistsService
  ) { }

  async create(
    createPatientDto: CreatePatientDto,
    profilePicture: Express.Multer.File,
    previusFollowUps?: Express.Multer.File[]
  ) {
    const queryRunner =
      this.patientRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const patient = this.patientRepository.create(
        new Patient({ ...createPatientDto, medicines: [], parents: [] })
      );
      if (
        createPatientDto.parents &&
        createPatientDto.parents
          .map((parent) => parent.cpf.cpf)
          .includes(createPatientDto.person.cpf.cpf)
      ) {
        throw new InternalServerErrorException(
          'cpf repetido entre pais e filhos'
        );
      }

      let [psychologist, person, comorbidities, parents] =
        await Promise.all([
          this.psychologistService.findOne(createPatientDto.psychologistId),
          this.setPerson(createPatientDto.person, profilePicture),
          this.setComorbities(createPatientDto.comorbidities),
          this.setParents(createPatientDto.parents),
        ]);

      patient.psychologist = psychologist;
      patient.person = person;
      patient.comorbidities = comorbidities;
      patient.parents = parents;

      if (createPatientDto.school) {
        let school = await this.setSchool(createPatientDto.school);
        patient.school = school;
      }
      let savedPatient = await this.patientRepository.save(patient, {
        transaction: false,
      });

      if (previusFollowUps) {
        await this.documentService.createFollowUps(
          savedPatient.id.id,
          previusFollowUps
        );
      }

      let medicines = await this.setMedicines(
        createPatientDto.medicines,
        savedPatient
      );
      savedPatient.medicines = medicines;
      await queryRunner.commitTransaction();
      return savedPatient;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(err?.message);
    }
  }

  private async setPerson(
    createPersondto: CreatePersonDto,
    profilePicture?: Express.Multer.File
  ) {
    let person = await this.personsService.create(
      createPersondto,
      true,
      profilePicture
    );
    return person;
  }

  private async setParents(parents: CreatePersonDto[]) {
    let setParents = [];
    for (let personDto of parents) {
      let parent: Person;
      try {
        parent = await this.personsService.findOneByCPF(personDto.cpf);
      } catch {
        parent = await this.personsService.create(personDto, true);
      }
      setParents.push(parent);
    }
    return setParents;
  }

  private async setSchool(schoolDto: CreateSchoolDto) {
    let school: School;
    try {
      school = await this.schoolService.findOneBy(schoolDto);
    } catch {
      school = await this.schoolService.create(schoolDto, true);
    }
    return school;
  }

  private async setMedicines(
    medicinesDto: CreateMedicamentInfoDto[],
    patient: Patient
  ) {
    let medicines: MedicamentInfo[] = [];
    for (let medicamentDto of medicinesDto) {
      let medicament = await this.medicamentInfoService.create(
        medicamentDto,
        patient,
        true
      );
      medicament.patient = undefined;
      medicines.push(medicament);
    }
    return medicines;
  }

  private async setComorbities(comorbidities: CreateComorbidityDto[]) {
    let setComorbidities: Comorbidity[] = [];
    for (let comorbidityDto of comorbidities) {
      let comorbidity = (
        await this.comorbiditiesService.findByName(comorbidityDto.name)
      ).at(0);
      if (!comorbidity)
        comorbidity = await this.comorbiditiesService.create(
          comorbidityDto,
          true
        );
      setComorbidities.push(comorbidity);
    }
    return setComorbidities;
  }

  async findAll() {
    return await this.patientRepository.find({
      relations: ['_school', '_comorbidities', '_person', '_parents'],
    });
  }

  async findAllMeetings(id: string) {
    return await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient._person', 'person')
      .innerJoinAndMapMany('patient._meetings', Meeting, "meeting", "meeting.Patient_id = :id", { id })
      .where('patient.id = :id', { id })
      .orderBy('meeting._schedule', 'DESC')
      .select([
        'person._name',
        'meeting.id',
        'meeting._schedule',
        'meeting._status',
      ])
      .getRawMany();
  }

  async findAllByPsychologist(id: string) {
    return await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient._person', 'person')
      .select([
        'patient.id',
        'person.name',
        'patient.payment_plan',
        'person.cpf',
      ])
      .where('patient.Psychologist_id = :id', { id })
      .getRawMany();
  }

  async findAllByPsychologistToANewMeeting(id: string) {
    return await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient._person', 'person')
      .select([
        'patient.id',
        'person.name',
        'patient.payment_plan',
        'person.cpf',
      ])
      .addSelect((subquery) => {
        return subquery
          .select('COUNT(meeting.id)', 'count')
          .from(Meeting, 'meeting')
          .where('meeting.Patient_id = patient.id')
          .andWhere('meeting._status != :status', { status: StatusType.CANCELED })
          .andWhere('meeting._schedule > NOW()')
      }, 'count_meetings')
      .addSelect((subquery) => {
        return subquery
          .select('COUNT(meeting.id)', 'count')
          .from(Meeting, 'meeting')
          .where('meeting.Patient_id = patient.id')
          .andWhere('meeting._status = :statusCredit', { statusCredit: StatusType.CREDIT })
      }, 'count_credits')
      .where('patient.Psychologist_id = :id', { id })
      .getRawMany();
  }

  async findOne(id: string, relations: boolean = true) {
    try {
      let queryBuilder = await this.patientRepository
        .createQueryBuilder('patient')
        .where('patient.id = :id', { id })
        .leftJoinAndSelect('patient._person', '_person')
      if (relations) {
        queryBuilder
          .leftJoinAndSelect('patient._school', 'school')
          .leftJoinAndSelect('school._address', 'school_address')
          .leftJoinAndSelect('patient._comorbidities', '_comorbidities')
          .leftJoinAndSelect('_person.address', '_address')
          .leftJoinAndSelect('patient._parents', '_parents')
      }
      let patient = await queryBuilder.getOneOrFail();
      if (relations) {
        patient.medicines = await this.medicamentInfoService.findAllToPatient(
          patient.id.id
        );

        patient.previewFollowUps = await this.documentService.findAllByPatient(
          patient.id.id
        );
      }
      return patient;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async addComorbities(id: string, comorbities: CreateComorbidityDto[]) {
    let updatingPatient = new Patient({});
    updatingPatient.id = new Id(id);
    updatingPatient.comorbidities = await this.setComorbities(comorbities);

    try {
      await this.patientRepository.save(updatingPatient);
      let patient = await this.findOne(id);
      return patient;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async addMedicaments(id: string, medicaments: CreateMedicamentInfoDto[]) {
    let updatingPatient = new Patient({});
    updatingPatient.id = new Id(id);

    try {
      updatingPatient.medicines = await this.setMedicines(
        medicaments,
        updatingPatient
      );
      let patient = await this.findOne(id);
      return patient;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const { person, school, comorbidities, parents, ...patientData } = updatePatientDto;

    try {
      await this.patientRepository.update(id, new Patient(patientData));
      let patient = await this.findOne(id);

      if (person && patient.person?.id?.id) {
        patient.person = await this.personsService.update(patient.person.id.id, person);
      }


      if (comorbidities) {
        patient.comorbidities = (await this.addComorbities(id, comorbidities)).comorbidities;
      }

      if (parents) {
        await Promise.all(
          parents.map(async (parent) => {
            const existing = patient.parents.find((v) => v.cpf.cpf === parent.cpf.cpf);
            if (existing) {
              return this.personsService.update(existing.id.id, parent);
            }
          })
        );
      }

      if (school && patient.school?.id?.id) {
        if (school.name === patient.school.name) {
          patient.school = await this.schoolService.update(patient.school.id.id, school);
        } else {
          let newSchool = await this.schoolService.findOneBy({ name: school.name }).catch(
            async (err) => {
              if (err.status !== 404) {
                throw err;
              }
              return this.schoolService.create(school as CreateSchoolDto, true);
            }
          );

          const updatedPatient = await this.patientRepository.createQueryBuilder("patient")
            .where("patient.id = :id", { id: patient.id.id })
            .getOneOrFail();

          updatedPatient.school = newSchool;
          await this.patientRepository.save(updatedPatient);
          patient.school = newSchool;
        }
      }

      return patient;
    } catch (err) {
      throw new InternalServerErrorException("Problemas ao atualizar paciente" + err?.message);
    }
  }

  async updateSchool(id: string, school: UpdateSchoolDto) {
    const newSchool = await this.schoolService.findOneBy(school);
    let updatingPatient = new Patient({});
    updatingPatient.school = newSchool;

    try {
      await this.patientRepository.update(id, updatingPatient);
      let patient = await this.findOne(id);
      return patient;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(id: string) {
    let patient = await this.findOne(id);
    const documents = await this.documentService.findAllByPatient(
      patient.id.id
    );

    await this.personsService.delete(patient.person.id.id);
    await this.patientRepository.delete(patient.id.id);
    if (documents) {
      for (const document of documents) {
        const publicID = document.docLink.split('/').slice(-1)[0];

        await this.cloudinaryService.deleteFileOtherThanImage(publicID);
      }
    }
  }

  async removeMedicament(patientId: string, medicamentId: string) {
    return await this.medicamentInfoService.remove(patientId, medicamentId);
  }
}
