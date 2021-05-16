import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "../schemas/User";
import { InjectModel } from "nestjs-typegoose";
import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Error, FilterQuery } from "mongoose";

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

  async insertUser(user: User): Promise<String> {
    const gg = new this.userModel(user)

    return new Promise(function(fulfil, reject) {
      gg.save({ validateBeforeSave: true }, (err: Error.ValidationError, res) => {
        if (err) {
          for(let i in err.errors){
            let error = err.errors[i]
              switch(error.path){
                case("username"): {
                  switch(error.kind){
                    case("minlength"):{
                      fulfil("username_too_short");
                      break;
                    }

                    case("maxlength"):{
                      fulfil("username_too_long");
                      break;
                    }

                    case("regexp"):{
                      fulfil("invalid_username");
                      break;
                    }
                  }
                  break;
                }

                case("mail"):{
                  fulfil("invalid_mail");
                  break;
                }
              }
          }

          // We are assuming that if it isn't a validation error it must be a MongoError
          switch((err as any).code){
            // Dirty hack but who cares
            case(11000):{
              fulfil(`${Object.keys((err as any).keyPattern)[0]}_taken`);
              break;
            }
          }
          // TODO: Error handling for duplicate Username, Email
          fulfil("error")
        } else {
          fulfil("successful");
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
