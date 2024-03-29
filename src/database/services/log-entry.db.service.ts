import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LogEntry } from '../schemas/LogEntry';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { FilterQuery } from 'mongoose';
import { User } from '../schemas/User';

@Injectable()
export class LogEntryDbService {
  constructor(
    @InjectModel(LogEntry)
    private readonly logEntryModel: ReturnModelType<typeof LogEntry>,
  ) {}

  async insertLogEntry(logEntry: LogEntry): Promise<boolean> {
    const gg = new this.logEntryModel(logEntry);
    return new Promise(function (fulfil, reject) {
      gg.save({ validateBeforeSave: true }, (err, res) => {
        if (err) {
          throw new HttpException('incomplete_data', HttpStatus.BAD_REQUEST);
        } else {
          fulfil(true);
        }
      });
    });
  }

  async deleteLogEntry(logEntry: DocumentType<LogEntry>): Promise<boolean> {
    return new Promise(function (fulfil, reject) {
      logEntry.deleteOne(null, (err, res) => {
        fulfil(!err);
      });
    });
  }

  async findLogEntries(
    query: FilterQuery<DocumentType<LogEntry>>,
  ): Promise<LogEntry[]> {
    const bookM = this.logEntryModel;
    return new Promise(function (fulfil, reject) {
      bookM
        .find(query)
        .exec()
        .then((res) => {
          if (res) {
            fulfil(res);
          } else {
            fulfil(null);
          }
        });
    });
  }

  async findLogEntry(
    query: FilterQuery<DocumentType<LogEntry>>,
  ): Promise<LogEntry> {
    const bookM = this.logEntryModel;
    return new Promise(function (fulfil, reject) {
      bookM
        .findOne(query)
        .exec()
        .then((res) => {
          if (res) {
            fulfil(res);
          } else {
            fulfil(null);
          }
        });
    });
  }
}
