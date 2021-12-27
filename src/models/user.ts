import {
  Model,
  DataTypes,
} from "sequelize";
import { UserInterface, UserCreationAttributes } from "../types/user";
import { sequelize } from '../configs/sequelize';

export class User extends Model<UserInterface, UserCreationAttributes>
  implements UserCreationAttributes {
  public id!: string; // Note that the `null assertion` `!` is required in strict mode.
  public login!: string;
  public isDeleted!: boolean; // for nullable fields
  public age!: number; // for nullable fields
  public password!: string; // for nullable fields

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  {
    sequelize, // passing the `sequelize` instance is required
  }
);
