import { Injectable, Scope } from "@nestjs/common";
import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { LogEntry } from "../entities/LogEntry";

@Injectable({ scope: Scope.TRANSIENT })
export class LogEntryDbService {
  logEntryRepository: EntityRepository<LogEntry> = this.em.fork(true, true).getRepository(LogEntry);

  constructor(
    private readonly em: EntityManager
  ) {
  }

}
