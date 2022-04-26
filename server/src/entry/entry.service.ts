import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entry } from '../model/entry.entity';
import { Repository, LessThan } from 'typeorm';
import { EntryDTO } from './entry.dto';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry) private readonly repo: Repository<Entry>,
  ) {}

  public REPROCESS_LIMIT = 4;

  public async getAll() {
    return await this.repo
      .find({
        take: parseInt(process.env.BATCH_LIMIT, 10) || 100,
        where: { reprocessCount: LessThan(this.REPROCESS_LIMIT) },
      })
      .then(items => items.map(e => EntryDTO.fromEntity(e)));
  }

  public async create(dto: EntryDTO): Promise<EntryDTO> {
    return this.repo.save(dto.toEntity()).then(e => EntryDTO.fromEntity(e));
  }

  public async remove(entriesDTO: EntryDTO[]) {
    this.repo.remove(entriesDTO.map(entry => entry.toEntity()));
  }

  public async update(entriesDTO: EntryDTO[]) {
    this.repo.save(entriesDTO.map(entry => entry.toEntity(true)));
  }
}
