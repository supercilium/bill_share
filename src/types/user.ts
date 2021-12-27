import { Optional } from 'sequelize/types';

export interface UserInterface {
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
    id: string;
}

export interface UserCreationAttributes extends Optional<UserInterface, 'id' | 'isDeleted'> {}
