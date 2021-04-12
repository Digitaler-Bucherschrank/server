import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "../schemas/User";
import { InjectModel } from "nestjs-typegoose";
import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { FilterQuery } from "mongoose";

@Injectable()
/**
 * Instance to communicate with the User collection in our database
 */

// TODO: auf andere Klassen auch übertragen
@Injectable()
export class UserDbService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) {
  }

  getModel(): ReturnModelType<typeof User> {
    return this.userModel
  }

  async insertUser(user: User): Promise<boolean> {
    const gg = new this.userModel(user)
    return new Promise(function(fulfil, reject) {
      gg.save(null, (err, res) => {
        if(err){
          throw new HttpException("incomplete_data", HttpStatus.BAD_REQUEST);
        } else {
          fulfil(true)
        }
      });
    })
  }

  async deleteUser(user: DocumentType<User>): Promise<boolean> {
    return new Promise(function(fulfil, reject) {
      user.deleteOne(null, (err, res) => {
        fulfil(!err);
      });
    })
  }

  async findUsers(query: FilterQuery<User>): Promise<DocumentType<User>[]> {
    const bookM = this.userModel;
    return new Promise(function(fulfil, reject) {
      bookM.find(query).exec().then( (res) => {
          if(res){
            fulfil(res)
          } else {
            fulfil(null)
          }
        }
      )
    })
  }

  async findUser(query: FilterQuery<User>): Promise<DocumentType<User>> {
    const bookM = this.userModel;
    return new Promise(function(fulfil, reject) {
      bookM.findOne(query).exec().then( (res) => {
          if(res){
            fulfil(res)
          } else {
            fulfil(null)
          }
        }
      )
    })
  }
}
